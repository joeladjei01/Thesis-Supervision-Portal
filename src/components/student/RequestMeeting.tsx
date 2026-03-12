import React, { useMemo } from 'react';
import { useFormik } from 'formik'; // Only need useFormik now
import * as Yup from 'yup';
import CustomSelect from '../shared/custom-select';
import { handleSelectionOnChange } from '../../utils/helpers';
import AppInput from '../shared/input/AppInput';
import SolidButton from '../shared/buttons/SolidButton';

// --- Typescript Interfaces and Mock Data ---

type MeetingType = 'Virtual' | 'In-Person';

interface FormData {
  meetingType: MeetingType;
  selectedDate: string; // YYYY-MM-DD format
  selectedTime: string; // HH:MM AM/PM format
  agenda: string;
}

interface Student {
  id: string;
  name: string;
}

const MOCK_STUDENTS: Student[] = [
  { id: '', name: 'Select student' },
  { id: '1', name: 'Alice Johnson' },
  { id: '2', name: 'Bob Smith' },
  { id: '3', name: 'Charlie Brown' },
  { id: '4', name: 'Diana Prince' },
];

const MOCK_TIMES: string[] = [
  '',
  '10:00 AM',
  '11:30 AM',
  '02:00 PM',
  '03:30 PM',
  '04:00 PM',
];

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Simplified hardcoded calendar data for May 2024 to match the image visually.
// Dates are padded to fill the weeks correctly (May 1st is a Wednesday).
type Mdate = {
  day: number,
  month:  'current' | 'prev' | 'next'
}


const MAY_DATES: Mdate[] = [
    { day: 28, month: 'prev' }, { day: 29, month: 'prev' }, { day: 30, month: 'prev' },
    { day: 1, month: 'current' }, { day: 2, month: 'current' }, { day: 3, month: 'current' }, { day: 4, month: 'current' },
    { day: 5, month: 'current' }, { day: 6, month: 'current' }, { day: 7, month: 'current' }, { day: 8, month: 'current' },
    { day: 9, month: 'current' }, { day: 10, month: 'current' }, { day: 11, month: 'current' },
    { day: 12, month: 'current' }, { day: 13, month: 'current' }, { day: 14, month: 'current' }, { day: 15, month: 'current' },
    { day: 16, month: 'current' }, { day: 17, month: 'current' }, { day: 18, month: 'current' },
    { day: 19, month: 'current' }, { day: 20, month: 'current' }, { day: 21, month: 'current' }, { day: 22, month: 'current' },
    { day: 23, month: 'current' }, { day: 24, month: 'current' }, { day: 25, month: 'current' },
    { day: 26, month: 'current' }, { day: 27, month: 'current' }, { day: 28, month: 'current' }, { day: 29, month: 'current' },
    { day: 30, month: 'current' }, { day: 31, month: 'current' }, { day: 1, month: 'next' },
];

// --- Validation Schema (Yup) ---

const validationSchema = Yup.object().shape({
  meetingType: Yup.string().oneOf(['Virtual', 'In-Person'], 'Meeting type is required.').required('Meeting type is required.'),
  selectedDate: Yup.string().required('Date is required. Please select a day from the calendar.'),
  selectedTime: Yup.string().notOneOf([''], 'Time is required.'),
  agenda: Yup.string().required('Meeting agenda is required.').min(10, 'Agenda must be at least 10 characters.'),
});


// --- Custom Components ---

/** Renders the Virtual/In-Person toggle button group. */
const MeetingTypeToggle: React.FC<{ value: MeetingType, onChange: (type: MeetingType) => void }> = ({ value, onChange }) => {
  const isVirtual = value === 'Virtual';
  
  const buttonClass = (isActive: boolean) =>
    `px-8 py-3 w-1/2 text-sm cursor-pointer font-semibold text-blue-900 rounded-sm transition-all duration-300 ease-in-out 
     ${isActive
        ? 'bg-white '
        : 'bg-transparent '
     }`;

  return (
    <div className="flex w-full overflow-auto bg-blue-100 p-[3px] rounded-sm">
      <button
        type="button"
        className={` ${buttonClass(isVirtual)}`}
        onClick={() => onChange('Virtual')}
        aria-pressed={isVirtual}
      >
        Virtual
      </button>
      <button
        type="button"
        className={` ${buttonClass(!isVirtual)}`}
        onClick={() => onChange('In-Person')}
        aria-pressed={!isVirtual}
      >
        In-Person
      </button>
    </div>
  );
};


/** Renders the visually styled calendar grid (simplified functionality). */
const DatePicker: React.FC<{ selectedDate: string, onSelect: (date: string) => void }> = ({ selectedDate, onSelect }) => {
  // Use a fixed date for selection logic for this demo: '2024-05-xx'
  const isSelected = (day: number, month: 'current' | 'prev' | 'next') => {
    if (month !== 'current') return false;
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    return selectedDate === `2024-05-${formattedDay}`;
  };

  const handleDayClick = (day: number, month: 'current' | 'prev' | 'next') => {
    if (month === 'current') {
      const formattedDay = day < 10 ? `0${day}` : `${day}`;
      // When a date is selected, we call the onSelect handler, which is bound to formik.setFieldValue in the parent.
      onSelect(`2024-05-${formattedDay}`);
    }
  };

  return (
    <div className="mt-6 p-4 bg-white  rounded-xl shadow-lg border border-gray-200">
      
      {/* Calendar Header */}
      <div className="flex items-center justify-between text-gray-900  mb-4">
        <button type="button" className="text-gray-400 hover:text-gray-600  p-1" aria-label="Previous month">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <span className="text-lg font-bold">May</span>
        <button type="button" className="text-gray-400 hover:text-gray-600  p-1" aria-label="Next month">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
      </div>

      {/* Days of the Week */}
      <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-500  mb-2">
        {WEEK_DAYS.map(day => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Dates Grid */}
      <div className="grid grid-cols-7 text-sm">
        {MAY_DATES.map((date, index) => (
          <div key={index} className="py-2 flex justify-center">
            <button
              type="button"
              onClick={() => handleDayClick(date.day, date.month)}
              disabled={date.month !== 'current'}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200
                ${date.month === 'current'
                  ? 'font-semibold text-gray-900  hover:bg-blue-100'
                  : 'text-gray-400 cursor-not-allowed opacity-50'
                }
                ${isSelected(date.day, date.month)
                  ? 'bg-blue-600 text-white hover:bg-blue-700 '
                  : ''
                }`}
            >
              {date.day}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};


// --- Main Component ---

const RequestMeeting: React.FC = () => {
  const initialValues: FormData = useMemo(() => ({
    meetingType: 'Virtual', // Default to Virtual as it's selected in the image
    selectedDate: '',
    selectedTime: '',
    agenda: '',
  }), []);

  const formik = useFormik<FormData>({
    initialValues,
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      // Simulate API submission delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Meeting Scheduled Successfully:', values);
      
      // Optionally reset the form after successful submission
      // resetForm(); 
      setSubmitting(false);
    },
  });

  // Helper function for rendering manual error messages
  const renderError = (name: keyof FormData) => {
    return formik.touched[name] && formik.errors[name] ? (
      <div className="mt-1 text-sm text-red-500">{formik.errors[name]}</div>
    ) : null;
  };

  // Helper function for dynamic input styling
  const getInputClasses = (name: keyof FormData) => {
    return `block w-full rounded-xl border px-4 py-3 appearance-none cursor-pointer 
      ${formik.touched[name] && formik.errors[name] 
        ? 'border-red-500 focus:ring-red-500' 
        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
      }`;
  };


  return (
    <div className="flex items-center justify-center">
      {/* Replaced Formik's <Form> with standard <form> and attached formik.handleSubmit 
      */}
      <form onSubmit={formik.handleSubmit} className="w-full space-y-6">


        {/* 2. Meeting Type Toggle (Custom component using formik.setFieldValue) */}
        <div className="pt-4">
          <label htmlFor="meetingType" className={"text-blue-900 mb-1.5 font-semibold"}>
            Meeting Type
          </label>
          <MeetingTypeToggle
            value={formik.values.meetingType}
            onChange={(type) => {
              formik.setFieldValue('meetingType', type);
              // Manually set touched to trigger validation on interaction
              formik.setFieldTouched('meetingType', true, false); 
            }}
          />
          {renderError('meetingType')}
        </div>

        {/* 3. Date Picker (Custom component using formik.setFieldValue) */}
        <DatePicker
          selectedDate={formik.values.selectedDate}
          onSelect={(date) => {
            formik.setFieldValue('selectedDate', date);
            // Manually set touched to trigger validation on interaction
            formik.setFieldTouched('selectedDate', true, false); 
          }}
        />
        {/* Render error manually. Note: The text-center class is kept for visual placement. */}
        {formik.touched.selectedDate && formik.errors.selectedDate && (
          <div className="text-sm text-red-500 text-center">{formik.errors.selectedDate}</div>
        )}

        {/* 4. Time Select (Standard HTML Select) */}
        <div>
          <label htmlFor="selectedTime" className={"text-blue-900 mb-1.5 font-semibold"}>
            Time
          </label>
          <div className="relative">

            <CustomSelect 
                value={formik.values.selectedTime}
                options={MOCK_TIMES.map(t => ({ value: t, label: t || 'Select time' }))}
                onChange={options => handleSelectionOnChange(options, 'selectedTime', formik)}
            />
            
          </div>
          {renderError('selectedTime')}
        </div>

        {/* 5. Meeting Agenda Textarea (Standard HTML Textarea) */}
        <div>
            <AppInput
                label='Meeting Agenda'
                name='agenda'
                formik={formik}
                placeholder='What will be discussed in this meeting?'
                type='text'
                as='textarea'
            />
        </div>

        {/* 6. Submit Button */}
        <div>
            <SolidButton
                title={formik.isSubmitting ? 'Scheduling...' : 'Schedule Meeting'}
                type="submit"
                disabled={formik.isSubmitting}
                className='py-2 w-full'
            />
        </div>
      </form>
    </div>
  );
};

export default RequestMeeting;
