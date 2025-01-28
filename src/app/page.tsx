'use client'

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { convertToLunar, analyze, LunarDate } from '@/lib/dateutils';
import Markdown from 'react-markdown'


const BaziAnalyzer = () => {
  const [gregorianDate, setGregorianDate] = useState('');
  const [gregorianTime, setGregorianTime] = useState('');
  const [lunarDate, setLunarDate] = useState<LunarDate>({
    lunaryear: '',
    lunarmonth: '',
    lunarday: '',
    lunarhour: '',
    nianStem: '',
    nianBranch: '',
    yueStem: '',
    yueBranch: '',
    riStem: '',
    riBranch: '',
    shiStem: '',
    shiBranch: '',
    lunar: '',
    dateobject: null
  });
  const [results, setResults] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  // Modify handleSubmit
  const handleSubmit = async (event : React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const results = await analyze(lunarDate);
      setResults(results || '');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">AI 八字命理分析</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* 陽曆生日輸入 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                陽曆生日
              </label>
              <div className="grid grid-cols-7 gap-4">
                <div className="relative col-span-3">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hidden sm:block" />
                  <input
                    type="date"
                    value={gregorianDate}
                    onChange={(e) => setGregorianDate(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="relative col-span-2">
                  <input
                    type="time"
                    value={gregorianTime}
                    onChange={(e) => setGregorianTime(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="col-span-2">

                  <button
                    onClick={() => {
                      const dateParts = gregorianDate.split('-');
                      const timeParts = gregorianTime.split(':');
                      const year = parseInt(dateParts[0], 10);
                      const month = parseInt(dateParts[1], 10);
                      const day = parseInt(dateParts[2], 10);
                      const hour = parseInt(timeParts[0], 10);
                      const minute = parseInt(timeParts[1], 10);
                      const lunarDate = convertToLunar(year, month, day, hour, minute);
                      console.log('Lunar Date:', lunarDate);
                      setLunarDate(lunarDate);
                    }}
                    type="button"
                    className="w-full h-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    轉換
                  </button>
                </div>
              </div>
            </div>

            {/* 農曆生日輸入 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                農曆生日
              </label>
              <div className="grid grid-cols-4 gap-4">
                <div className="relative">
                  <input
                    value={lunarDate.lunaryear || ''}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    readOnly
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">年</span>
                </div>
                <div className="relative">
                  <input
                    value={lunarDate.lunarmonth || ''}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    readOnly
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">月</span>
                </div>
                <div className="relative">
                  <input
                    value={lunarDate.lunarday || ''}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    readOnly
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">日</span>
                </div>
                <div className="relative">
                  <input
                    value={lunarDate.lunarhour || ''}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    readOnly
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">時</span>
                </div>
              </div>
            </div>



          {/* Bazi Display Grid */}
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">八字排盤</h3>
            <div className="grid grid-cols-4 gap-4">
              {/* Year Pillar */}
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-2">年柱</div>
                <div className="grid grid-rows-2 gap-2">
                  <div className="bg-blue-50 p-4 rounded-lg">{lunarDate.nianStem}</div>
                  <div className="bg-green-50 p-4 rounded-lg">{lunarDate.nianBranch}</div>
                </div>
              </div>

              {/* Month Pillar */}
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-2">月柱</div>
                <div className="grid grid-rows-2 gap-2">
                  <div className="bg-blue-50 p-4 rounded-lg">{lunarDate.yueStem}</div>
                  <div className="bg-green-50 p-4 rounded-lg">{lunarDate.yueBranch}</div>
                </div>
              </div>

              {/* Day Pillar */}
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-2">日柱</div>
                <div className="grid grid-rows-2 gap-2">
                  <div className="bg-blue-50 p-4 rounded-lg">{lunarDate.riStem}</div>
                  <div className="bg-green-50 p-4 rounded-lg">{lunarDate.riBranch}</div>
                </div>
              </div>

              {/* Hour Pillar */}
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-2">時柱</div>
                <div className="grid grid-rows-2 gap-2">
                  <div className="bg-blue-50 p-4 rounded-lg">{lunarDate.shiStem}</div>
                  <div className="bg-green-50 p-4 rounded-lg">{lunarDate.shiBranch}</div>
                </div>
              </div>
            </div>
          </div>

            <button
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  分析中...
                </>
              ) : (
                '開始分析'
              )}
            </button>
          </form>

          {results && (
            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">八字解析</h3>

              {/* 流年運勢 */}
              <div className="bg-gray-50 rounded-lg p-4 analysis">
                <div className="space-y-2">
                  <Markdown>{results}</Markdown>
                  <p>想要知道更多如何利用 AI 轉運，找到好人緣，也可以參加我們的來臨的【<a href="https://ticket.jooymedia.com" className="mt-5 text-blue-600 font-medium hover:text-blue-800 underline decoration-2 underline-offset-2 hover:decoration-blue-800 transition-colors duration-200" target="_blank" rel="noopener noreferrer">AI轉運站</a>】工作坊，學習各種不同的 AI 結合命理的技巧喔！</p>
                </div>
              </div>
            </div>
          )}

        </CardContent>
      </Card>
      <div className="mt-8">
        <img src="/lead-logo-2024-black.png" alt="Lead Logo 2024 Black" className="mx-auto w-24" />
        <p className="text-center text-sm text-gray-500 mt-5">All rights reserved UCAN Technologies Sdn. Bhd. 2025</p>
        <p className="text-center text-sm text-gray-500 mt-5 md:w-1/2 mx-auto">本應用程式僅作為AI命理預測能力的展示用途，不涉及任何宗教或迷信活動的推廣。我們希望透過此應用展示中國傳統文化如何在AI時代創新應用。本程式採用開源程式碼開發，僅供學習參考，預測結果請自行判斷其準確性。</p>
      <p></p>
      </div>

    </div>
  );
};

export default BaziAnalyzer;
