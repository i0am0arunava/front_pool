import { useState, useEffect } from "react";

interface UseStudentPollTimerProps {
  poll: {
    pollId: string;
    timeLimit: number;
    startTime?: number;
    status?: "waiting" | "active" | "ended";
  };
  hasSubmitted: boolean;
  showResults: boolean;
}

export const useStudentPollTimer = ({
  poll,
  hasSubmitted,
  showResults,
}: UseStudentPollTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(poll.timeLimit);

  // Real-time timer countdown
  useEffect(() => {
    // Debug logging
    console.log("🔍 Timer useEffect:", {
      pollId: poll.pollId,
      startTime: poll.startTime,
      timeLimit: poll.timeLimit,
      status: poll.status,
      hasSubmitted,
      showResults,
    });

    if (
      !poll.startTime ||
      hasSubmitted ||
      showResults ||
      poll.status !== "active"
    ) {
      console.log(
        "⏹️ Timer stopped - no startTime, hasSubmitted, showResults, or poll not active"
      );
      setTimeRemaining(poll.timeLimit);
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const elapsed = Math.floor((now - poll.startTime!) / 1000);
      const remaining = Math.max(0, poll.timeLimit - elapsed);
      setTimeRemaining(remaining);

      // Debug every 10 seconds
      if (elapsed % 10 === 0) {
        console.log("⏰ Timer update:", {
          elapsed,
          remaining,
          timeLimit: poll.timeLimit,
        });
      }
    };

    // Update immediately
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [
    poll.startTime,
    poll.timeLimit,
    poll.pollId,
    poll.status,
    hasSubmitted,
    showResults,
  ]);

  // Reset timer when poll changes
  useEffect(() => {
    setTimeRemaining(poll.timeLimit);
  }, [poll.pollId, poll.timeLimit]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const isTimeUp = timeRemaining <= 0;
  const isTimeWarning = timeRemaining <= 10 && timeRemaining > 0;

  return {
    timeRemaining,
    formattedTime: formatTime(timeRemaining),
    isTimeUp,
    isTimeWarning,
  };
};
