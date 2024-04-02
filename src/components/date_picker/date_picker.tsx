import Image from 'next/image';
import {useCallback, useState, useEffect, Dispatch, SetStateAction} from 'react';
import useOuterClick from '../../lib/hooks/use_outer_click';
import {AiOutlineLeft, AiOutlineRight} from 'react-icons/ai';
import {MONTH_LIST, WEEK_LIST, DEFAULT_PAGE} from '../../constants/config';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';
import {IDatePeriod} from '../../interfaces/date_period';
import {timestampToString} from '../../lib/common';

type Dates = {
  date: number;
  time: number;
  disable: boolean;
};
interface IPopulateDatesParams {
  daysInMonth: Dates[];
  selectedYear: number;
  selectedMonth: number;
  selectTimeOne: number;
  selectDateOne: (date: Dates | null) => void;
  selectTimeTwo: number;
  selectDateTwo: (date: Dates | null) => void;
  setComponentVisible: Dispatch<SetStateAction<boolean>>;
}

interface IDatePickerProps {
  period: IDatePeriod;
  setFilteredPeriod: Dispatch<SetStateAction<IDatePeriod>>;
  isLinearBg?: boolean;
  loading?: boolean;
  datePickerHandler?: (start: number, end: number) => Promise<void>;
  setActivePage?: Dispatch<SetStateAction<number>>;
}

// Info:(20230530 - Julian) Safari 只接受 YYYY/MM/DD 格式的日期
const PopulateDates = ({
  daysInMonth,
  selectedYear,
  selectedMonth,
  selectTimeOne,
  selectDateOne,
  selectTimeTwo,
  selectDateTwo,
  setComponentVisible,
}: IPopulateDatesParams) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  // Info: (20230831 - Julian) 用於日期樣式
  const beforeStyle =
    'before:absolute before:-z-10 before:w-27px before:h-24px before:rounded-full before:bg-primaryBlue';

  // Info: (20230830 - Julian) 顯示星期標題
  const weekNameList = WEEK_LIST.map((week, index) => (
    <p className="mx-auto h-24px w-24px" key={index}>
      {t(week)}
    </p>
  ));

  // Info: (20240318 - Liz) 將時間戳記還原為當天日期且時間設置為 00:00:00 的時間戳記
  const resetTimestampToMidnight = (timestamp: number) => {
    const date = new Date(timestamp); // Info: (20240318 - Liz) 將時間戳記轉換為日期物件

    date.setHours(0, 0, 0); // Info: (20240318 - Liz) 將時間設置為當天的 00:00:00

    return date.getTime(); // Info: (20240318 - Liz) 獲取更新後的時間戳記並回傳
  };

  // Info: (20230830 - Julian) 顯示月份中的每一天
  const formatDaysInMonth = daysInMonth.map((el: Dates, index) => {
    const date = el ? new Date(`${selectedYear}/${selectedMonth}/${el.date} 00:00:00`) : null;

    // Info: (20240318 - Liz) 因為 selectTimeTwo 是 23:59:59，所以還原時間設置為 00:00:00
    const selectTimeTwoReset = resetTimestampToMidnight(selectTimeTwo);

    // Info: (20230831 - Julian) 已選擇區間的樣式
    const isSelectedPeriodStyle =
      selectTimeOne &&
      selectTimeTwoReset &&
      date?.getTime() &&
      date?.getTime() >= selectTimeOne &&
      date?.getTime() <= selectTimeTwoReset &&
      selectTimeOne !== selectTimeTwoReset
        ? 'bg-primaryBlue-500'
        : '';

    // Info: (20230831 - Julian) DateOne 和 DateTwo 的樣式
    const isSelectedDateStyle = date?.getTime()
      ? !selectTimeTwoReset && date.getTime() === selectTimeOne
        ? 'rounded-full bg-primaryBlue text-darkPurple3'
        : selectTimeOne && selectTimeTwoReset
        ? date.getTime() === selectTimeOne && date.getTime() === selectTimeTwoReset
          ? `rounded-full text-darkPurple3 bg-primaryBlue`
          : date.getTime() === selectTimeOne
          ? `rounded-l-full text-darkPurple3 before:left-px ${beforeStyle}`
          : date.getTime() === selectTimeTwoReset
          ? `rounded-r-full text-darkPurple3 before:right-px ${beforeStyle}`
          : ''
        : ''
      : '';

    /* Info: (20230830 - Julian) 只有可選擇的日期才能點擊 */
    const dateClickHandler = () => {
      if (el?.date && !el?.disable) {
        // Info: (20230831 - Julian) elTemp 是點擊的日期
        const elTime = new Date(`${selectedYear}/${selectedMonth}/${el.date} 00:00:00`).getTime();
        if (selectTimeOne !== 0 && selectTimeTwo !== 0) {
          // Info: (20230831 - Julian) 如果有已選擇的日期區間，則先清除
          selectDateOne(null);
          selectDateTwo(null);
        }
        if (selectTimeOne === 0) {
          // Info: (20230831 - Julian) 如果第一個日期尚未選擇，則將 el 填入第一個日期
          selectDateOne(el);
        } else if (selectTimeTwo === 0) {
          // Info: (20230831 - Julian) 如果第二個日期尚未選擇，則將 el 填入第二個日期
          if (selectTimeOne > elTime) {
            // Info: (20230831 - Julian) 檢查 TimeOne 是否大於 TimeTwo，如果是則交換
            const temp = new Date(selectTimeOne);
            selectDateOne(el);
            selectDateTwo({
              date: temp.getDate(),
              time: new Date(
                // Info: (20230831 - Julian) 這裡的月份要加 1，因為 new Date() 的月份是 0 ~ 11
                `${temp.getFullYear()}/${temp.getMonth() + 1}/${temp.getDate()}`
              ).getTime(),
              disable: true,
            });
          } else {
            // Info: (20230831 - Julian) 如果 TimeOne 小於 TimeTwo，則直接填入
            selectDateTwo(el);
          }
          setComponentVisible(false);
        }
      }
    };

    return (
      <button
        key={index}
        disabled={el?.disable}
        className={`relative z-10 h-24px whitespace-nowrap px-1 ${isSelectedDateStyle} ${isSelectedPeriodStyle} transition-all duration-150 ease-in-out disabled:text-lilac`}
        onClick={dateClickHandler}
      >
        {el?.date ?? ' '}
      </button>
    );
  });

  return (
    <div className="grid grid-cols-7 gap-y-2 text-center text-base">
      {weekNameList}
      {formatDaysInMonth}
    </div>
  );
};

const SECONDS_IN_A_DAY = 86400 - 1;
const MILLISECONDS_IN_A_SECOND = 1000;

const DatePicker = ({
  period,
  setFilteredPeriod,
  isLinearBg,
  loading,
  setActivePage,
}: //datePickerHandler,
IDatePickerProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const {targetRef, componentVisible, setComponentVisible} = useOuterClick<HTMLDivElement>(false);

  const today = new Date();
  const maxDate = today;

  const [dateOne, setDateOne] = useState<Date | null>(
    new Date(period.startTimeStamp * MILLISECONDS_IN_A_SECOND)
  );
  const [dateTwo, setDateTwo] = useState<Date | null>(
    new Date(period.endTimeStamp * MILLISECONDS_IN_A_SECOND)
  );

  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1); // 0 (January) to 11 (December).
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  const [displayPeriod, setDisplayPeriod] = useState<string>(t('DATE_PICKER.SELECT_PERIOD'));

  useEffect(() => {
    // Info: (20230831 - Julian) 如果已取得兩個日期，則將日期區間傳回父層
    // Info: (20230901 - Julian) 如果兩個日期相同，則將日期區間設為當天 00:00:00 ~ 23:59:59
    const dateOneStamp = dateOne ? dateOne.getTime() / MILLISECONDS_IN_A_SECOND : 0;
    const dateTwoStamp = dateTwo ? dateTwo.getTime() / MILLISECONDS_IN_A_SECOND : 0;

    if (dateOneStamp && dateTwoStamp) {
      const isSameDate = dateOneStamp === dateTwoStamp;
      setFilteredPeriod({
        startTimeStamp: dateOneStamp,
        endTimeStamp: isSameDate ? dateTwoStamp + SECONDS_IN_A_DAY : dateTwoStamp,
      });
      setActivePage && setActivePage(DEFAULT_PAGE);
    } else {
      // Info: (20240402 - Liz) 如果沒有選擇日期，則將日期區間設為 0
      setFilteredPeriod({
        startTimeStamp: 0,
        endTimeStamp: 0,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateOne, dateTwo]);

  // Info: (20230601 - Julian) 取得該月份第一天是星期幾
  const firstDayOfMonth = (year: number, month: number) => {
    return new Date(`${year}/${month}/01`).getDay();
  };

  // Info: (20230601 - Julian) 取得該月份的所有天數
  const daysInMonth = (year: number, month: number) => {
    const day = firstDayOfMonth(year, month);
    const dateLength = new Date(year, month, 0).getDate();
    let dates: Dates[] = [];
    for (let i = 0; i < dateLength; i++) {
      const dateTime = new Date(`${year}/${month}/${i + 1}`).getTime();

      const maxTime = maxDate
        ? new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate()).getTime()
        : null;

      const date = {
        date: i + 1,
        time: dateTime,
        disable: maxTime ? (dateTime > maxTime ? true : false) : false,
      };
      dates.push(date);
    }
    dates = Array(...Array(day)).concat(dates);
    return dates;
  };

  const goToNextMonth = useCallback(() => {
    let month = selectedMonth;
    let year = selectedYear;
    month++;
    if (month > 12) {
      month = 1;
      year++;
    }
    setSelectedMonth(month);
    setSelectedYear(year);
  }, [selectedMonth, selectedYear]);

  const goToPrevMonth = useCallback(() => {
    let month = selectedMonth;
    let year = selectedYear;
    month--;
    if (month < 1) {
      month = 12;
      year--;
    }
    setSelectedMonth(month);
    setSelectedYear(year);
  }, [selectedMonth, selectedYear]);

  const selectDateOne = useCallback((el: Dates | null) => {
    if (!el) return setDateOne(null);
    const newDate = new Date(el.time);
    // Info: (20240205 - Liz) 設定時間為當天的開始（00:00:00）
    newDate.setHours(0, 0, 0);
    setDateOne(newDate);
  }, []);

  const selectDateTwo = useCallback((el: Dates | null) => {
    if (!el) return setDateTwo(null);
    const newDate = new Date(el.time);
    // Info: (20240205 - Liz) 設定時間為當天的最後一秒（23:59:59）
    newDate.setHours(23, 59, 59);
    setDateTwo(newDate);
  }, []);

  // Info: (20230830 - Julian) 選單開關
  const openCalenderHandler = () => setComponentVisible(!componentVisible);
  // Info: (20230830 - Julian) 選擇今天
  const todayClickHandler = () => {
    const dateOfToday = new Date(
      `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()} 00:00:00`
    );

    // Info: (20230901 - Julian) 選擇區間改成今天
    setDateOne(dateOfToday);
    setDateTwo(dateOfToday);
    setSelectedMonth(today.getMonth() + 1);
    setSelectedYear(today.getFullYear());
    setComponentVisible(false);
  };

  // Info: (20230830 - Julian) 顯示時間區間
  useEffect(() => {
    // Info: (20230830 - Julian) 如果起始時間和結束時間都是 0，則顯示文字
    if (period.startTimeStamp === 0 && period.endTimeStamp === 0) {
      setDisplayPeriod(t('DATE_PICKER.SELECT_PERIOD'));
      return;
    }

    const periodStr =
      dateOne && dateTwo && dateOne.getTime() !== 0 && dateTwo.getTime() !== 0
        ? `${timestampToString(dateOne.getTime() / MILLISECONDS_IN_A_SECOND).date} ${t(
            'DATE_PICKER.TO'
          )} ${timestampToString(dateTwo.getTime() / MILLISECONDS_IN_A_SECOND).date}`
        : t('DATE_PICKER.SELECT_PERIOD');
    setDisplayPeriod(periodStr);
  }, [period.endTimeStamp, period.startTimeStamp, t, dateOne, dateTwo]);

  useEffect(() => {
    // Info: (20240402 - Julian) 如果日期區間是 0，則清空日期
    if (period.startTimeStamp === 0 && period.endTimeStamp === 0) {
      setDateOne(null);
      setDateTwo(null);
    }
  }, [period.startTimeStamp, period.endTimeStamp]);

  // Info: (20230830 - Julian) 顯示月份和年份
  const displayMonthAndYear = `${t(MONTH_LIST[selectedMonth - 1])} ${selectedYear}`;

  // useEffect(() => {
  //   if (!datePickerHandler) return;
  //   datePickerHandler && datePickerHandler(dateOne?.getTime() ?? 0, dateTwo?.getTime() ?? 0);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [componentVisible]);

  return (
    <div className="relative flex w-full flex-col items-center lg:w-auto">
      {/* Info: (20230830 - Julian) Select Period button */}

      <div
        onClick={openCalenderHandler}
        className={`flex w-full items-center space-x-3 rounded p-4 font-inter ${
          isLinearBg ? 'bg-purpleLinear' : 'bg-darkPurple'
        } text-hoverWhite hover:cursor-pointer lg:w-250px`}
      >
        <p className="flex-1 whitespace-nowrap text-sm">{displayPeriod}</p>
        <Image src="/icons/calender.svg" width={24} height={24} alt="calender_icon" />
      </div>

      {/* Info: (20230830 - Julian) Calender part */}
      <div
        ref={targetRef}
        className={`absolute top-16 z-20 grid w-250px items-center space-y-4 rounded ${
          componentVisible && !loading
            ? 'visible translate-y-0 grid-rows-1 opacity-100'
            : 'invisible -translate-y-10 grid-rows-0 opacity-0'
        } bg-purpleLinear p-5 shadow-xl transition-all duration-500 ease-in-out`}
      >
        {/* Info: (20230830 - Julian) Today button */}
        <button
          onClick={todayClickHandler}
          className="w-full rounded border-2 border-hoverWhite p-1 text-sm font-bold text-hoverWhite hover:border-primaryBlue hover:text-primaryBlue"
        >
          {t('DATE_PICKER.TODAY')}
        </button>
        <div className="flex w-full items-center">
          {/* Info: (20230830 - Julian) Month and Year */}
          <p className="flex-1 font-semibold text-primaryBlue">{displayMonthAndYear}</p>
          {/* Info: (20230830 - Julian) Previous and Next button */}
          <div className="flex items-center space-x-3 text-hoverWhite">
            <button onClick={goToPrevMonth} className="text-hoverWhite hover:text-primaryBlue">
              <AiOutlineLeft />
            </button>
            <button onClick={goToNextMonth} className="text-hoverWhite hover:text-primaryBlue">
              <AiOutlineRight />
            </button>
          </div>
        </div>
        <PopulateDates
          daysInMonth={daysInMonth(selectedYear, selectedMonth)}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          selectTimeOne={dateOne?.getTime() ?? 0}
          selectDateOne={selectDateOne}
          selectTimeTwo={dateTwo?.getTime() ?? 0}
          selectDateTwo={selectDateTwo}
          setComponentVisible={setComponentVisible}
        />
      </div>
    </div>
  );
};

export default DatePicker;
