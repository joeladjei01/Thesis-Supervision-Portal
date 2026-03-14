import React, { useMemo } from 'react';
import { useFormik } from 'formik'; // Only need useFormik now
import * as Yup from 'yup';
import CustomSelect from '../shared/custom-select';
import { handleSelectionOnChange } from '../../utils/helpers';
import AppInput from '../shared/input/AppInput';
import SolidButton from '../shared/buttons/SolidButton';
import { Calendar } from '../ui/calendar';
import { format, parse } from 'date-fns';

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
    `px-8 py-3 w-1/2 text-sm cursor-pointer font-bold rounded-md transition-all duration-300 ease-in-out 
     ${isActive
        ? 'bg-card text-primary shadow-sm'
        : 'bg-transparent text-muted-foreground hover:text-foreground'
     }`;

  return (
    <div className="flex w-full overflow-hidden bg-muted p-1 rounded-lg border border-border">
      <button
        type="button"
        className={buttonClass(isVirtual)}
        onClick={() => onChange('Virtual')}
        aria-pressed={isVirtual}
      >
        Virtual
      </button>
      <button
        type="button"
        className={buttonClass(!isVirtual)}
        onClick={() => onChange('In-Person')}
        aria-pressed={!isVirtual}
      >
        In-Person
      </button>
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
      <div className="mt-1.5 text-xs font-semibold text-destructive italic">{formik.errors[name]}</div>
    ) : null;
  };

  // Helper function for dynamic input styling
  const getInputClasses = (name: keyof FormData) => {
    return `block w-full rounded-xl border px-4 py-3 appearance-none cursor-pointer transition-colors
      ${formik.touched[name] && formik.errors[name] 
        ? 'border-destructive focus:ring-destructive bg-destructive/5' 
        : 'border-border focus:ring-primary bg-muted/30 text-foreground'
      }`;
  };


  return (
    <div className="flex items-center justify-center">
      {/* Replaced Formik's <Form> with standard <form> and attached formik.handleSubmit 
      */}
      <form onSubmit={formik.handleSubmit} className="w-full space-y-6">


        {/* 2. Meeting Type Toggle (Custom component using formik.setFieldValue) */}
        <div className="pt-2">
          <label htmlFor="meetingType" className={"text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 block"}>
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

        {/* 3. Calendar Wrapper */}
        <div className="mt-6 p-4 bg-card rounded-2xl shadow-sm border border-border flex justify-center">
            <Calendar
                mode="single"
                selected={formik.values.selectedDate ? parse(formik.values.selectedDate, 'yyyy-MM-dd', new Date()) : undefined}
                onSelect={(date) => {
                    const formattedDate = date ? format(date, 'yyyy-MM-dd') : '';
                    formik.setFieldValue('selectedDate', formattedDate);
                    formik.setFieldTouched('selectedDate', true, false); 
                }}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                className="w-full"
            />
        </div>
        {/* Render error manually. Note: The text-center class is kept for visual placement. */}
        {formik.touched.selectedDate && formik.errors.selectedDate && (
          <div className="text-xs font-semibold text-destructive text-center mt-2 italic">{formik.errors.selectedDate}</div>
        )}

        {/* 4. Time Select (Standard HTML Select) */}
        <div>
          <div className="relative">

            <AppInput
            label='Time'
            type='time'
            name='selectedTime'
            formik={formik}
            />
            
          </div>
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
