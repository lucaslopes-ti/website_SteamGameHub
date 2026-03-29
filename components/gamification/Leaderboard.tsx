"use client";

import { useEffect, useState } from "react";
import { Trophy, Medal, Award } from "lucide-react";

interface LeaderboardEntry {
  userId: string;
  userName: string;
  xp: number;
  position: number;
}

interface LeaderboardProps {
  activityId: string;
  className?: string;
}

export default function Leaderboard({ activityId, className }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, [activityId]);

  const loadLeaderboard = async () => {
    try {
      const response = await fetch(`/api/atividades/leaderboard?activityId=${activityId}`);
      if (response.ok) {
        const data = await response.json();
        setEntries(data.entries || []);
      }
    } catch (error) {
      console.error("Erro ao carregar leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMedalIcon = (position: number) => {
    if (position === 1) return <Trophy className="w-5 h-5 text-yellow-400" />;
    if (position === 2) return <Medal className="w-5 h-5 text-gray-300" />;
    if (position === 3) return <Award className="w-5 h-5 text-orange-400" />;
    return <span className="text-gray-400 font-bold">#{position}</span>;
  };

  return (
    <div className={`bg-senai-blueDark border border-senai-blue rounded-lg p-6 ${className}`}>
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Trophy className="w-6 h-6 text-yellow-400" />
        Leaderboard
      </h3>

      {loading ? (
        <div className="text-center py-8 text-gray-400">Carregando...</div>
      ) : entries.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p>Nenhum participante ainda.</p>
          <p className="text-sm mt-2">Seja o primeiro a completar!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.slice(0, 10).map((entry) => (
            <div
              key={entry.userId}
              className={`flex items-center justify-between p-3 rounded-lg ${
                entry.position <= 3
                  ? "bg-yellow-400/10 border border-yellow-400/30"
                  : "bg-senai-dark border border-senai-blue"
              }`}
            >
              <div className="flex items-center gap-3">
                {getMedalIcon(entry.position)}
                <span
                  className={`font-medium ${
                    entry.position <= 3 ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  {entry.userName || entry.userId.split("@")[0]}
                </span>
              </div>
              <span className="text-senai-orange font-bold">{entry.xp} XP</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

