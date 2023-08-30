import Image from 'next/image';
import React, {useCallback, useState} from 'react';
import useOuterClick from '../../lib/hooks/use_outer_click';
import {AiOutlineLeft, AiOutlineRight} from 'react-icons/ai';
import {MONTH_LIST, WEEK_LIST} from '../../constants/config';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/locale';

type Dates = {
  date: number;
  time: number;
  disable: boolean;
};
interface IPopulateDatesParams {
  daysInMonth: Dates[];
  selectedTime: number;
  selectedYear: number;
  selectedMonth: number;
  selectDate: (date: Dates) => void;
  selectStartTime: number;
  selectStartDate: (date: Dates) => void;
  selectEndTime: number;
  selectEndDate: (date: Dates) => void;
}

interface IDatePickerProps {
  date: Date;
  //minDate: Date;
  maxDate: Date;
  setDate: (date: Date) => void;
}

/* Info:(20230530 - Julian) Safari 只接受 YYYY/MM/DD 格式的日期 */
const PopulateDates = ({
  daysInMonth,
  selectedTime,
  selectedYear,
  selectedMonth,
  selectDate,
  selectStartTime,
  selectStartDate,
  selectEndTime,
  selectEndDate,
}: IPopulateDatesParams) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  /* Info: (20230830 - Julian) Display week name */
  const weekNameList = WEEK_LIST.map((week, index) => (
    <p className="h-24px w-24px" key={index}>
      {t(week)}
    </p>
  ));

  const beforeStyle =
    'before:absolute before:-z-10 before:w-27px before:h-24px before:rounded-full before:bg-primaryBlue';

  /* Info: (20230830 - Julian) Display days in month */
  const formatDaysInMonth = daysInMonth.map((el: Dates, index) => {
    const date = el ? new Date(`${selectedYear}/${selectedMonth}/${el.date} 00:00:00`) : null;
    //const isSelected = date?.getTime() && date?.getTime() === selectedTime ? true : false;
    const isStart = date?.getTime() && date?.getTime() === selectStartTime ? true : false;
    const isEnd = date?.getTime() && date?.getTime() === selectEndTime ? true : false;
    const isSelectedPeriod =
      date?.getTime() && date?.getTime() >= selectStartTime && date?.getTime() <= selectEndTime
        ? true
        : false;

    /* Info: (20230830 - Julian) Only clickable date can be selected*/
    const dateClickHandler = () => {
      //if (el?.date && !el?.disable) selectDate(el);
      if (el?.date && !el?.disable) {
        if (selectStartTime === 0) {
          selectStartDate(el);
        } else if (selectEndTime === 0) {
          selectEndDate(el);
        }
      }
    };

    return (
      <button
        key={index}
        disabled={el?.disable}
        className={`relative z-10 h-24px whitespace-nowrap px-1
        ${isSelectedPeriod ? 'bg-primaryBlue-500' : ''}
         ${isStart ? `rounded-l-full text-darkPurple3 before:left-0 ${beforeStyle}` : ''} ${
          isEnd ? `rounded-r-full text-darkPurple3 before:right-0 ${beforeStyle}` : ''
        } 
         ${/*isSelected ? 'bg-primaryBlue text-darkPurple3' : ''*/ ''} 
        transition-all duration-150 ease-in-out disabled:text-lilac`}
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

const DatePicker = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const {targetRef, componentVisible, setComponentVisible} = useOuterClick<HTMLDivElement>(false);

  const [date, setDate] = useState(new Date('2023/08/30 00:00:00'));
  const [dateStart, setDateStart] = useState<Date | null>();
  const [dateEnd, setDateEnd] = useState<Date | null>();
  const maxDate = new Date();

  const [selectedMonth, setSelectedMonth] = useState(date.getMonth() + 1); // 0 (January) to 11 (December).
  const [selectedYear, setSelectedYear] = useState(date.getFullYear());

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
      const dateTime = new Date(`${year}/${month + 1}/${i + 1}`).getTime();

      const maxTime = maxDate
        ? new Date(maxDate.getFullYear(), maxDate.getMonth() + 1, maxDate.getDate()).getTime()
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
    if (month > 11) {
      month = 0;
      year++;
    }
    setSelectedMonth(month);
    setSelectedYear(year);
  }, [selectedMonth, selectedYear]);

  const goToPrevMonth = useCallback(() => {
    let month = selectedMonth;
    let year = selectedYear;
    month--;
    if (month < 0) {
      month = 11;
      year--;
    }
    setSelectedMonth(month);
    setSelectedYear(year);
  }, [selectedMonth, selectedYear]);

  const selectDate = useCallback(
    (el: Dates) => {
      let newDate = new Date(el.time);
      newDate = new Date(`${newDate.getFullYear()}/${newDate.getMonth()}/${newDate.getDate()}`);
      setDate(newDate);
    },
    [maxDate, selectedMonth, selectedYear, date]
  );

  const selectStartDate = useCallback(
    (el: Dates) => {
      let newDate = new Date(el.time);
      newDate = new Date(`${newDate.getFullYear()}/${newDate.getMonth()}/${newDate.getDate()}`);
      setDateStart(newDate);
    },
    [maxDate, selectedMonth, selectedYear, date, dateStart, dateEnd]
  );

  const selectEndDate = useCallback(
    (el: Dates) => {
      let newDate = new Date(el.time);
      newDate = new Date(`${newDate.getFullYear()}/${newDate.getMonth()}/${newDate.getDate()}`);
      setDateEnd(newDate);
    },
    [maxDate, selectedMonth, selectedYear, date, dateStart, dateEnd]
  );

  // Info: (20230830 - Julian) 選單開關
  const openCalendeHandler = () => setComponentVisible(!componentVisible);
  // Info: (20230830 - Julian) 選擇今天
  const todayClickHandler = () => {
    const today = new Date();
    setDate(new Date(`${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()} 00:00:00`));
    setSelectedMonth(today.getMonth() + 1);
    setSelectedYear(today.getFullYear());
  };

  // Info: (20230830 - Julian) 顯示月份和年份
  const monthAndYear = `${t(MONTH_LIST[selectedMonth - 1])} ${selectedYear}`;

  return (
    <div className="relative">
      {/* Info: (20230830 - Julian) Select Period button */}

      <div
        onClick={openCalendeHandler}
        className="flex w-300px items-center space-x-3 rounded bg-darkPurple px-6 py-4 font-inter text-hoverWhite hover:cursor-pointer"
      >
        <p className="flex-1 text-base">{t('DATE_PICKER.SELECT_PERIOD')}</p>
        <Image src="/icons/calender.svg" width={24} height={24} alt="calender_icon" />
      </div>

      {/* Info: (20230830 - Julian) Calender part */}
      <div
        ref={targetRef}
        className={`absolute top-16 grid items-center space-y-4 rounded ${
          componentVisible
            ? 'visible translate-y-0 grid-rows-1 opacity-100'
            : 'invisible -translate-y-10 grid-rows-0 opacity-0'
        } bg-purpleLinear px-4 py-3 shadow-xl transition-all duration-500 ease-in-out`}
      >
        {/* Till:(20230830 - Julian) debug 用，記得刪除 */}
        {/* {`${dateStart?.getFullYear() ?? 0} / ${dateStart?.getMonth() ?? 0} / ${
          dateStart?.getDate() ?? 0
        }`}{' '}
        ~
        {` ${dateEnd?.getFullYear() ?? 0} / ${dateEnd?.getMonth() ?? 0} / ${
          dateEnd?.getDate() ?? 0
        }`} */}
        {/* Info: (20230830 - Julian) Today button */}
        <button
          onClick={todayClickHandler}
          className="w-full rounded border-2 border-hoverWhite p-1 text-sm font-bold text-hoverWhite hover:border-primaryBlue hover:text-primaryBlue"
        >
          {t('DATE_PICKER.TODAY')}
        </button>
        <div className="flex w-full items-center">
          {/* Info: (20230830 - Julian) Month and Year */}
          <p className="flex-1 font-semibold text-primaryBlue">{monthAndYear}</p>
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
          selectedTime={date.getTime()}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          selectDate={selectDate}
          selectStartTime={dateStart?.getTime() ?? 0}
          selectStartDate={selectStartDate}
          selectEndTime={dateEnd?.getTime() ?? 0}
          selectEndDate={selectEndDate}
        />
      </div>
    </div>
  );
};

export default DatePicker;
