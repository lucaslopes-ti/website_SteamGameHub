/**
 * Fake Firestore para testes das API routes da SQL Quest.
 *
 * Suporta o subconjunto usado pelas rotas: collection().doc(id).get/set/update,
 * collection().doc() (auto-id), collection().add, collection().where(...).get,
 * onde(...).where(...) encadeado, db.getAll(...refs) e db.runTransaction(fn).
 *
 * A transação fake:
 * - exige TODAS as leituras antes de qualquer escrita (como o Firestore real);
 * - aceita tanto `DocumentReference` quanto `Query` em `tx.get(...)`;
 * - expõe `tx.create(...)` (create-only);
 * - SERIALIZA transações concorrentes numa fila, de modo que duas transações
 *   nunca observem o mesmo estado e escrevam por cima uma da outra. Isso
 *   reproduz, no que o fake suporta, a semântica atômica necessária para
 *   limitar reservas globais em POSTs concorrentes.
 */

export type Store = Record<string, Record<string, Record<string, unknown>>>;

interface FakeSnapshot {
  id?: string;
  exists: boolean;
  data: () => Record<string, unknown> | null;
}

interface FakeQueryDoc {
  id: string;
  exists: true;
  data: () => Record<string, unknown>;
}

interface FakeQuerySnapshot {
  docs: FakeQueryDoc[];
  empty: boolean;
  size: number;
}

interface FakeFilter {
  field: string;
  op: string;
  value: unknown;
}

interface FakeRef {
  id: string;
  __collection: string;
  get: () => Promise<FakeSnapshot>;
  set: (data: unknown, opts?: { merge?: boolean }) => Promise<void>;
  create: (data: unknown) => Promise<void>;
  update: (data: Record<string, unknown>) => Promise<void>;
  delete: () => Promise<void>;
}

interface FakeQuery {
  __query: true;
  __collection: string;
  __filters: FakeFilter[];
  where: (field: string, op: string, value: unknown) => FakeQuery;
  limit: (count: number) => FakeQuery;
  get: () => Promise<FakeQuerySnapshot>;
}

function matchesFilter(
  data: Record<string, unknown>,
  filter: FakeFilter
): boolean {
  const actual = data[filter.field];
  switch (filter.op) {
    case "==":
      return actual === filter.value;
    case "array-contains":
      return Array.isArray(actual) && actual.includes(filter.value);
    case "in":
      return Array.isArray(filter.value) && filter.value.includes(actual);
    default:
      return false;
  }
}

export function createFakeDb(initial?: Store) {
  const store: Store = initial ?? {};
  let autoIdCounter = 0;
  // Fila que serializa transações concorrentes (modelo de atomicidade).
  let transactionQueue: Promise<unknown> = Promise.resolve();

  const snapshotOf = (collectionName: string, id: string): FakeSnapshot => ({
    id,
    exists: Boolean(store[collectionName]?.[id]),
    data: () => store[collectionName]?.[id] ?? null,
  });

  const readDocs = (
    collectionName: string,
    filters: FakeFilter[]
  ): FakeQueryDoc[] =>
    Object.entries(store[collectionName] ?? {})
      .filter(([, data]) => filters.every((filter) => matchesFilter(data, filter)))
      .map(([id, data]) => ({ id, exists: true as const, data: () => data }));

  const querySnapshot = (
    collectionName: string,
    filters: FakeFilter[]
  ): FakeQuerySnapshot => {
    const docs = readDocs(collectionName, filters);
    return { docs, empty: docs.length === 0, size: docs.length };
  };

  const makeRef = (collectionName: string, id: string): FakeRef => ({
    id,
    __collection: collectionName,
    get: async () => snapshotOf(collectionName, id),
    set: async (data, opts) => {
      store[collectionName] = store[collectionName] ?? {};
      const record = data as Record<string, unknown>;
      if (opts?.merge) {
        store[collectionName][id] = { ...(store[collectionName][id] ?? {}), ...record };
      } else {
        store[collectionName][id] = record;
      }
    },
    create: async (data) => {
      if (store[collectionName]?.[id]) {
        const error = new Error("Document already exists");
        (error as { code?: unknown }).code = "already-exists";
        throw error;
      }
      store[collectionName] = store[collectionName] ?? {};
      store[collectionName][id] = data as Record<string, unknown>;
    },
    update: async (data) => {
      store[collectionName] = store[collectionName] ?? {};
      store[collectionName][id] = { ...(store[collectionName][id] ?? {}), ...data };
    },
    delete: async () => {
      delete store[collectionName]?.[id];
    },
  });

  const makeQuery = (
    collectionName: string,
    filters: FakeFilter[]
  ): FakeQuery => {
    const query: FakeQuery = {
      __query: true,
      __collection: collectionName,
      __filters: filters,
      where: (field, op, value) =>
        makeQuery(collectionName, [...filters, { field, op, value }]),
      limit: () => query,
      get: async () => querySnapshot(collectionName, filters),
    };
    return query;
  };

  const collection = (name: string) => ({
    doc: (id?: string) => {
      if (id) return makeRef(name, id);
      autoIdCounter += 1;
      return makeRef(name, `auto-${autoIdCounter}`);
    },
    add: async (data: unknown) => {
      autoIdCounter += 1;
      const id = `auto-${autoIdCounter}`;
      store[name] = store[name] ?? {};
      store[name][id] = data as Record<string, unknown>;
      return { id };
    },
    where: (field: string, op: string, value: unknown) =>
      makeQuery(name, [{ field, op, value }]),
    get: async () => querySnapshot(name, []),
  });

  const db = {
    collection,
    getAll: async (...refs: FakeRef[]) =>
      refs.map((ref) => snapshotOf(ref.__collection, ref.id)),
    runTransaction: (fn: (tx: unknown) => Promise<void>): Promise<void> => {
      const execute = async () => {
        // Simula a regra do Firestore real: TODAS as leituras devem ocorrer
        // antes de qualquer escrita dentro da transação.
        let wrote = false;
        const tx = {
          get: async (target: FakeRef | FakeQuery) => {
            if (wrote) {
              throw new Error(
                "Firestore: leituras devem ocorrer antes de escritas na transação"
              );
            }
            if ((target as FakeQuery).__query) {
              const query = target as FakeQuery;
              return querySnapshot(query.__collection, query.__filters);
            }
            const ref = target as FakeRef;
            return snapshotOf(ref.__collection, ref.id);
          },
          set: async (ref: FakeRef, data: unknown, opts?: { merge?: boolean }) => {
            wrote = true;
            store[ref.__collection] = store[ref.__collection] ?? {};
            const record = data as Record<string, unknown>;
            if (opts?.merge) {
              store[ref.__collection][ref.id] = {
                ...(store[ref.__collection][ref.id] ?? {}),
                ...record,
              };
            } else {
              store[ref.__collection][ref.id] = record;
            }
          },
          create: async (ref: FakeRef, data: unknown) => {
            wrote = true;
            if (store[ref.__collection]?.[ref.id]) {
              const error = new Error("Document already exists");
              (error as { code?: unknown }).code = "already-exists";
              throw error;
            }
            store[ref.__collection] = store[ref.__collection] ?? {};
            store[ref.__collection][ref.id] = data as Record<string, unknown>;
          },
          update: async (ref: FakeRef, data: Record<string, unknown>) => {
            wrote = true;
            store[ref.__collection] = store[ref.__collection] ?? {};
            store[ref.__collection][ref.id] = {
              ...(store[ref.__collection][ref.id] ?? {}),
              ...data,
            };
          },
        };
        await fn(tx);
      };

      // Serializa: a próxima transação só começa após a anterior terminar
      // (mesmo se a anterior falhar). Sem isso, POSTs concorrentes poderiam
      // contar o mesmo estado duas vezes.
      const run = transactionQueue.then(execute, execute);
      transactionQueue = run.then(
        () => undefined,
        () => undefined
      );
      return run;
    },
  };

  return { db, store };
}

export type FakeDb = ReturnType<typeof createFakeDb>["db"];
