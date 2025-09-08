import type {
  LeaderboardEntry,
  CurrentUserInfo,
  ChartData,
  AnalyticsData,
} from "../types/leaderboard";

function getChartColors() {
  const root = document.documentElement;
  const style = getComputedStyle(root);

  return {
    chart1: style.getPropertyValue("--chart-1").trim(),
    chart2: style.getPropertyValue("--chart-2").trim(),
    chart3: style.getPropertyValue("--chart-3").trim(),
    chart4: style.getPropertyValue("--chart-4").trim(),
    chart5: style.getPropertyValue("--chart-5").trim(),
  };
}

export function generateUserSubjectPerformance(
  currentUser: CurrentUserInfo
): ChartData {
  const colors = getChartColors();
  const subjects = currentUser.subjects.map((s) => s.subjectId.title);
  const scores = currentUser.subjects.map((s) => s.totalMarkScored);

  return {
    labels: subjects,
    datasets: [
      {
        label: "Your Score",
        data: scores,
        backgroundColor: [colors.chart1, colors.chart2, colors.chart3],
        borderColor: [colors.chart1, colors.chart2, colors.chart3],
        borderWidth: 2,
      },
    ],
  };
}

export function generateUserVsTopPerformers(
  data: LeaderboardEntry[],
  currentUser: CurrentUserInfo
): ChartData {
  const colors = getChartColors();
  const topFive = data.slice(0, 5);
  const names = [
    "You",
    ...topFive.map((entry) => entry.userId.name.split(" ")[0]),
  ];
  const scores = [
    currentUser.totalMarkScored,
    ...topFive.map((entry) => entry.totalMarkScored),
  ];
  const backgroundColors = [
    colors.chart5,
    colors.chart3,
    colors.chart3,
    colors.chart3,
    colors.chart3,
    colors.chart3,
  ];

  return {
    labels: names,
    datasets: [
      {
        label: "Total Score",
        data: scores,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors,
        borderWidth: 2,
      },
    ],
  };
}

export function generateUserAccuracyComparison(
  data: LeaderboardEntry[],
  currentUser: CurrentUserInfo
): ChartData {
  const colors = getChartColors();
  const subjects = ["Physics", "Chemistry", "Mathematics"];
  const userAccuracies: number[] = [];
  const avgAccuracies: number[] = [];

  subjects.forEach((subject) => {
    const subjectLower = subject.toLowerCase();
    const userSubject = currentUser.subjects.find((s) => {
      const title = s.subjectId.title.toLowerCase();
      return (
        title.includes(subjectLower) ||
        (subjectLower === "mathematics" && title.includes("math"))
      );
    });
    userAccuracies.push(userSubject ? userSubject.accuracy : 0);

    let totalAccuracy = 0;
    let count = 0;
    data.forEach((entry) => {
      const entrySubject = entry.subjects.find((s) => {
        const title = s.subjectId.title.toLowerCase();
        return (
          title.includes(subjectLower) ||
          (subjectLower === "mathematics" && title.includes("math"))
        );
      });
      if (entrySubject) {
        totalAccuracy += entrySubject.accuracy;
        count++;
      }
    });
    avgAccuracies.push(count > 0 ? totalAccuracy / count : 0);
  });

  return {
    labels: subjects,
    datasets: [
      {
        label: "Your Accuracy",
        data: userAccuracies,
        backgroundColor: colors.chart4,
        borderColor: colors.chart4,
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: "Average Accuracy",
        data: avgAccuracies,
        backgroundColor: colors.chart2,
        borderColor: colors.chart2,
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };
}

export function generateUserRankProgress(
  currentUser: CurrentUserInfo
): ChartData {
  const colors = getChartColors();
  const totalStudents = 1000;
  const userRank = currentUser.rank;
  const betterThan = totalStudents - userRank;
  const worseOrEqual = userRank - 1;

  return {
    labels: ["Students Below You", "Students Above You"],
    datasets: [
      {
        label: "Students",
        data: [betterThan, worseOrEqual],
        backgroundColor: [colors.chart2, colors.chart3], 
        borderColor: [colors.chart2, colors.chart3],
        borderWidth: 2,
      },
    ],
  };
}

export function generateAnalyticsData(
  data: LeaderboardEntry[],
  currentUser?: CurrentUserInfo | null
): AnalyticsData {
  if (!currentUser) {
    return {
      scoreDistribution: { labels: [], datasets: [] },
      subjectPerformance: { labels: [], datasets: [] },
      accuracyTrend: { labels: [], datasets: [] },
      topPerformersComparison: { labels: [], datasets: [] },
    };
  }

  return {
    scoreDistribution: generateUserSubjectPerformance(currentUser),
    subjectPerformance: generateUserRankProgress(currentUser),
    accuracyTrend: generateUserAccuracyComparison(data, currentUser),
    topPerformersComparison: generateUserVsTopPerformers(data, currentUser),
  };
}
