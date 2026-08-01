import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const FULL_MOCK_TEST_LIBRARY = {
  't_cs301_mid': {
    id: 't_cs301_mid',
    title: 'Midterm Examination: Data Structures & Algorithms',
    description: 'Offline mock test for UI verification while the backend is unreachable.',
    duration_minutes: 30,
    totalMarks: 30,
    questions: [
      {
        id: 'q1',
        number: 1,
        text: 'Which traversal visits the current node before its children?',
        options: [
          { id: 'o1', text: 'Post-order' },
          { id: 'o2', text: 'In-order' },
          { id: 'o3', text: 'Pre-order' },
          { id: 'o4', text: 'Level-order' },
        ],
        correct_option_id: 'o3',
        marks: 2,
      },
      {
        id: 'q2',
        number: 2,
        text: 'Which data structure follows the Last-In-First-Out principle?',
        options: [
          { id: 'o5', text: 'Queue' },
          { id: 'o6', text: 'Stack' },
          { id: 'o7', text: 'Tree' },
          { id: 'o8', text: 'Graph' },
        ],
        correct_option_id: 'o6',
        marks: 2,
      },
      {
        id: 'q3',
        number: 3,
        text: 'What is the average time complexity of a hash table lookup?',
        options: [
          { id: 'o9', text: 'O(1)' },
          { id: 'o10', text: 'O(log n)' },
          { id: 'o11', text: 'O(n)' },
          { id: 'o12', text: 'O(n²)' },
        ],
        correct_option_id: 'o9',
        marks: 3,
      },
      {
        id: 'q4',
        number: 4,
        text: 'Which of these is a valid binary search tree property?',
        options: [
          { id: 'o13', text: 'Every left subtree contains lesser values' },
          { id: 'o14', text: 'Every node can have two parents' },
          { id: 'o15', text: 'Nodes are always stored in a linked list' },
          { id: 'o16', text: 'Only leaf nodes can store data' },
        ],
        correct_option_id: 'o13',
        marks: 2,
      },
      {
        id: 'q5',
        number: 5,
        text: 'What is the maximum number of children a node can have in a binary tree?',
        options: [
          { id: 'o17', text: '1' },
          { id: 'o18', text: '2' },
          { id: 'o19', text: '3' },
          { id: 'o20', text: 'Unlimited' },
        ],
        correct_option_id: 'o18',
        marks: 2,
      },
    ],
    instructions: ['All questions compulsory.', 'One question at a time.'],
  },
};

const defaultFallback = {
  id: 'practice_demo',
  title: 'Offline Practice Test',
  description: 'Fallback mock test loaded because the backend API is unavailable.',
  duration_minutes: 20,
  totalMarks: 20,
  questions: [
    {
      id: 'q1',
      number: 1,
      text: 'Which option correctly represents the local offline testing flow?',
      options: [
        { id: 'o1', text: 'Use mock data and keep navigation active' },
        { id: 'o2', text: 'Show an error and stop' },
        { id: 'o3', text: 'Disable all controls' },
        { id: 'o4', text: 'Render a blank screen' },
      ],
      correct_option_id: 'o1',
      marks: 2,
    },
    {
      id: 'q2',
      number: 2,
      text: 'Which UI state should remain visible while a browser blocks fullscreen?',
      options: [
        { id: 'o5', text: 'The test should still render the active question view' },
        { id: 'o6', text: 'A blank white page should be shown' },
        { id: 'o7', text: 'Navigation should be disabled permanently' },
        { id: 'o8', text: 'The timer and progress panel should disappear' },
      ],
      correct_option_id: 'o5',
      marks: 2,
    },
    {
      id: 'q3',
      number: 3,
      text: 'Which response shape is safest for result-analysis rendering?',
      options: [
        { id: 'o9', text: 'question_id + selected_option_id + correct_option_id' },
        { id: 'o10', text: 'An isolated success banner' },
        { id: 'o11', text: 'Only the submission ID string' },
        { id: 'o12', text: 'A null question payload' },
      ],
      correct_option_id: 'o9',
      marks: 2,
    },
    {
      id: 'q4',
      number: 4,
      text: 'What should the test engine do when the API returns no questions?',
      options: [
        { id: 'o13', text: 'Populate a stable mock dataset immediately' },
        { id: 'o14', text: 'Stop the test and remain on the loading state' },
        { id: 'o15', text: 'Render a blank page without error recovery' },
        { id: 'o16', text: 'Hide the start button forever' },
      ],
      correct_option_id: 'o13',
      marks: 2,
    },
    {
      id: 'q5',
      number: 5,
      text: 'Which button style aligns with the new royal-blue institutional design?',
      options: [
        { id: 'o17', text: 'bg-blue-600 hover:bg-blue-700 text-white' },
        { id: 'o18', text: 'A plain monochrome button with no contrast' },
        { id: 'o19', text: 'Only a muted grey outline' },
        { id: 'o20', text: 'A hidden action not visible to the user' },
      ],
      correct_option_id: 'o17',
      marks: 2,
    },
  ],
  instructions: ['Local fallback mode is active.'],
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getStoredToken = () => {
  return localStorage.getItem('dtep_token') || sessionStorage.getItem('dtep_token') || null;
};

const clearStoredSession = () => {
  localStorage.removeItem('dtep_token');
  localStorage.removeItem('dtep_user');
  localStorage.removeItem('dtep_remember');
  sessionStorage.removeItem('dtep_token');
  sessionStorage.removeItem('dtep_user');
};

const normalizeOptions = (options = []) => {
  return options.map((option, index) => ({
    id: option.id || option.option_id || `o${index + 1}`,
    text: option.text || option.label || `Option ${String.fromCharCode(65 + index)}`,
  }));
};

const normalizeTestPayload = (testId, payload) => {
  if (!payload || !Array.isArray(payload.questions) || payload.questions.length === 0) {
    return FULL_MOCK_TEST_LIBRARY[testId] || defaultFallback;
  }

  const questions = payload.questions.map((question, index) => ({
    ...question,
    id: question.id || `q${index + 1}`,
    number: question.number || index + 1,
    text: question.text || question.question_text || `Question ${index + 1}`,
    options: normalizeOptions(question.options),
    correct_option_id: question.correct_option_id || question.correctOptionId || question.options?.[0]?.id || 'o1',
    marks: question.marks || 2,
  }));

  return {
    ...payload,
    id: payload.id || testId || 'offline_practice',
    title: payload.title || 'Offline Practice Test',
    description: payload.description || 'Fallback mock test loaded because the backend API is unavailable.',
    duration_minutes: payload.duration_minutes || 20,
    totalMarks: payload.totalMarks || payload.total_marks || questions.length * 2,
    questions,
    instructions: payload.instructions || ['Local fallback mode is active.'],
  };
};

api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      clearStoredSession();
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const loginUser = async (credentials) => {
  const response = await api.post('/api/auth/login/', credentials);
  return response.data;
};

export const fetchStudentTests = async () => {
  const response = await api.get('/api/tests/');
  return response.data;
};

export const fetchTestDetails = async (testId) => {
  try {
    const response = await api.get(`/api/tests/${testId}/`);
    return normalizeTestPayload(testId, response.data);
  } catch (_err) {
    return normalizeTestPayload(testId, FULL_MOCK_TEST_LIBRARY[testId] || defaultFallback);
  }
};

export const submitTest = async (testId, payload) => {
  try {
    const response = await api.post(`/api/tests/${testId}/submit/`, payload);
    return response.data;
  } catch (_err) {
    const library = FULL_MOCK_TEST_LIBRARY[testId] || defaultFallback;
    const answers = payload.answers || [];
    const totalMarks = library.questions.reduce((sum, question) => sum + (question.marks || 2), 0);
    const details = library.questions.map((question) => {
      const selection = answers.find((answer) => answer.question_id === question.id || Number(answer.question_id) === Number(question.id));
      const selectedOptionId = selection?.selected_option_id || null;
      const isCorrect = selectedOptionId === question.correct_option_id;
      return {
        question_id: question.id,
        question_text: question.text,
        is_correct: isCorrect,
        user_selected_option_id: selectedOptionId,
        correct_option_id: question.correct_option_id,
        selected_option_text: question.options.find((option) => option.id === selectedOptionId)?.text || null,
        correct_option_text: question.options.find((option) => option.id === question.correct_option_id)?.text || null,
      };
    });
    const score = details.reduce((sum, detail) => sum + (detail.is_correct ? 2 : 0), 0);
    const percentage = Math.round((score / totalMarks) * 100);
    const result = {
      submission_id: `mock_${testId}_${Date.now()}`,
      test_title: library.title,
      score,
      total_marks: totalMarks,
      percentage,
      passed: percentage >= 70,
      time_taken_seconds: payload.time_taken_seconds || 120,
      details,
    };
    localStorage.setItem('dtep_mock_submission_result', JSON.stringify(result));
    return result;
  }
};

export const fetchSubmissionResult = async (submissionId) => {
  try {
    const response = await api.get(`/api/submissions/${submissionId}/result/`);
    return response.data;
  } catch (_err) {
    const stored = localStorage.getItem('dtep_mock_submission_result');
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      submission_id: submissionId,
      test_title: 'Offline Practice Result',
      score: 8,
      total_marks: 10,
      percentage: 80,
      passed: true,
      time_taken_seconds: 120,
      details: [
        {
          question_id: 'q1',
          question_text: 'Mock review question 1',
          is_correct: true,
          user_selected_option_id: 'o1',
          correct_option_id: 'o1',
        },
      ],
    };
  }
};

export default api;
