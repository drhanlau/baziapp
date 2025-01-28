import { Solar } from "lunar-javascript";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface LunarDate {
  lunar: string;
  dateobject: Solar;
  lunaryear: string;
  lunarmonth:string;
  lunarday: string;
  nian: string;
  yue: string;
  ri: string;
  shi: string;
}

// 八字的時柱計算

type HeavenlyStem = '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸';
type EarthlyBranch = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥';

type TimePeriod = {
  start: number;
  end: number;
  branch: EarthlyBranch;
};

const TIME_PERIODS: TimePeriod[] = [
  { start: 23, end: 1, branch: '子' },
  { start: 1, end: 3, branch: '丑' },
  { start: 3, end: 5, branch: '寅' },
  { start: 5, end: 7, branch: '卯' },
  { start: 7, end: 9, branch: '辰' },
  { start: 9, end: 11, branch: '巳' },
  { start: 11, end: 13, branch: '午' },
  { start: 13, end: 15, branch: '未' },
  { start: 15, end: 17, branch: '申' },
  { start: 17, end: 19, branch: '酉' },
  { start: 19, end: 21, branch: '戌' },
  { start: 21, end: 23, branch: '亥' },
];

const STEM_BRANCH_TABLE: Record<HeavenlyStem, HeavenlyStem[]> = {
  甲: ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸', '甲', '乙'],
  乙: ['丙', '丁', '戊', '己', '庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁'],
  丙: ['戊', '己', '庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己'],
  丁: ['庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛'],
  戊: ['壬', '癸', '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
  己: ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸', '甲', '乙'],
  庚: ['丙', '丁', '戊', '己', '庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁'],
  辛: ['戊', '己', '庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己'],
  壬: ['庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛'],
  癸: ['壬', '癸', '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
};

function calculateTimeStem(dayStem: HeavenlyStem, hour: number): { data: { stem: HeavenlyStem; branch: EarthlyBranch }; shizhu: string } {
  // 確定天干

  const earthlyBranch = TIME_PERIODS.find((period) => {
    if (period.start > period.end) {
      return hour >= period.start || hour < period.end;
    }
    return hour >= period.start && hour < period.end;
  });

  const branch = earthlyBranch?.branch;

  // 確定天干
  const stems = STEM_BRANCH_TABLE[dayStem[0]];
  const index = TIME_PERIODS.findIndex((period) => period.branch === branch);
  const stem = stems[index];

  console.log({ data: { stem, branch }, shizhu: `${stem}${branch}` })

  return { data:{stem, branch}, shizhu: `${stem}${branch}` };
}


/**
 * Converts a Gregorian date to a Lunar date
 * @param year - Gregorian year
 * @param month - Gregorian month
 * @param day - Gregorian day
 * @returns Lunar date information
 */
export const convertToLunar = (year: number, month: number, day: number, hour: number, minute: number): LunarDate => {
  const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
  const lunar = solar.getLunar();
  const shizhu = calculateTimeStem(lunar.getDayInGanZhi(), hour).shizhu

  return {
    lunar: solar.getLunar().toFullString(),
    dateobject: solar,
    lunaryear: lunar.getYearInGanZhi(),
    lunarmonth: lunar.getMonthInChinese(),
    lunarday: lunar.getDay(),
    lunarhour:shizhu[1],
    nianStem: lunar.getYearInGanZhi()[0],
    nianBranch: lunar.getYearInGanZhi()[1],
    yueStem: lunar.getMonthInGanZhi()[0],
    yueBranch: lunar.getMonthInGanZhi()[1],
    riStem: lunar.getDayInGanZhi()[0],
    riBranch: lunar.getDayInGanZhi()[1],
    shiStem: shizhu[0],
    shiBranch: shizhu[1],
  };
};

export const analyze = () => {
  console.log('analyze')
  const makeOpenAIRequest = async () => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: `測試乙巳年運程, 八字年干為 ${lunar.getYearInGanZhi()[0]}, 年支為 ${lunar.getYearInGanZhi()[1]}, 八字月干為 ${lunar.getMonthInGanZhi()[0]}, 月支為 ${lunar.getMonthInGanZhi()[1]}, 八字日干為 ${lunar.getDayInGanZhi()[0]}, 日支為 ${lunar.getDayInGanZhi()[1]}, 八字時干為 ${shizhu[0]}, 時支為 ${shizhu[1]}`
            }
          ],
          temperature: 0.7
        })
      });

      const data = await response.json();
      console.log(data);
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      throw error;
    }
  };
}
