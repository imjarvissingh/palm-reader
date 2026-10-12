import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { generatePalmReport } from '@/features/palm/engine';
import { AppStateProvider } from '@/state/AppState';
import { PalmDraftProvider } from '@/state/palmDraft';
import { DEFAULT_STATE, type PersistedState } from '@/state/persist';

const mockRouter = { push: jest.fn(), replace: jest.fn(), back: jest.fn(), canGoBack: jest.fn(() => true) };
const mockParams: { current: Record<string, string> } = { current: {} };

jest.mock('expo-router', () => {
  const { Text: RNText } = jest.requireActual('react-native');
  return {
    router: mockRouter,
    useLocalSearchParams: () => mockParams.current,
    useNavigation: () => ({ setOptions: jest.fn() }),
    Redirect: ({ href }: { href: string }) => <RNText>{`redirect:${href}`}</RNText>,
    Stack: { Screen: () => null },
  };
});

const mockPermission: { current: unknown } = { current: null };
const mockRequest = jest.fn();
jest.mock('expo-camera', () => ({
  CameraView: () => null,
  useCameraPermissions: () => [mockPermission.current, mockRequest],
}));
jest.mock('expo-image-picker', () => ({ launchImageLibraryAsync: jest.fn(async () => ({ canceled: true, assets: [] })) }));
jest.mock('@/features/palm/photoStore', () => ({ deletePhoto: jest.fn(), deleteAllPhotos: jest.fn(), preparePhoto: jest.fn(), persistPhoto: jest.fn() }));
const mockConfirm = jest.fn(async () => true);
jest.mock('@/lib/confirm', () => ({ confirmDestructive: () => mockConfirm() }));

const metrics = { frame: { x: 0, y: 0, width: 390, height: 844 }, insets: { top: 47, left: 0, right: 0, bottom: 34 } };

function wrap(ui: React.ReactElement, initial: PersistedState = DEFAULT_STATE) {
  return render(
    <SafeAreaProvider initialMetrics={metrics}>
      <AppStateProvider initial={initial}>
        <PalmDraftProvider>{ui}</PalmDraftProvider>
      </AppStateProvider>
    </SafeAreaProvider>,
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  mockParams.current = {};
});

describe('launch routing', () => {
  it('sends first-time users to onboarding', async () => {
    const Index = require('@/app/index').default;
    await wrap(<Index />);
    expect(screen.getByText('redirect:/onboarding')).toBeTruthy();
  });

  it('sends returning users to the tabs', async () => {
    const Index = require('@/app/index').default;
    await wrap(<Index />, { ...DEFAULT_STATE, profile: { ...DEFAULT_STATE.profile, onboarded: true } });
    expect(screen.getByText('redirect:/(tabs)')).toBeTruthy();
  });
});

describe('onboarding', () => {
  it('calculates the sign, validates the date and completes', async () => {
    const Onboarding = require('@/app/onboarding').default;
    await wrap(<Onboarding />);
    await fireEvent.press(screen.getByTestId('onboarding-next'));
    await fireEvent.press(screen.getByTestId('onboarding-next'));
    await fireEvent.changeText(screen.getByTestId('onboarding-name'), 'Sam');
    await fireEvent.changeText(screen.getByTestId('birth-day'), '31');
    await fireEvent.changeText(screen.getByTestId('birth-month'), '4');
    await fireEvent.changeText(screen.getByTestId('birth-year'), '1994');
    expect(screen.getByText('That date does not exist.')).toBeTruthy();
    await fireEvent.changeText(screen.getByTestId('birth-day'), '3');
    await fireEvent.changeText(screen.getByTestId('birth-month'), '11');
    expect(screen.getByText('You are Scorpio')).toBeTruthy();
    await fireEvent.press(screen.getByTestId('onboarding-next'));
    await fireEvent.press(screen.getByTestId('onboarding-next'));
    expect(mockRouter.replace).toHaveBeenCalledWith('/(tabs)');
  });
});

describe('palm camera permissions', () => {
  it('explains a permanently denied camera and offers alternatives', async () => {
    mockPermission.current = { granted: false, canAskAgain: false, status: 'denied' };
    const Capture = require('@/app/palm/capture').default;
    await wrap(<Capture />);
    expect(screen.getByText('Camera access is off')).toBeTruthy();
    expect(screen.getByText('Open Settings')).toBeTruthy();
    await fireEvent.press(screen.getByText('Continue without a photo'));
    expect(mockRouter.replace).toHaveBeenCalledWith('/palm/questions');
  });

  it('asks for permission when it can', async () => {
    mockPermission.current = { granted: false, canAskAgain: true, status: 'undetermined' };
    const Capture = require('@/app/palm/capture').default;
    await wrap(<Capture />);
    await fireEvent.press(screen.getByTestId('grant-camera'));
    expect(mockRequest).toHaveBeenCalled();
  });
});

describe('reading history', () => {
  const r = (id: string) => generatePalmReport({ id, createdAt: new Date(2026, 9, 12), hand: 'right', isDominant: true, answers: { hand_shape: 'earth' } });

  it('shows an empty state', async () => {
    const History = require('@/app/history').default;
    await wrap(<History />);
    expect(screen.getByText('No readings yet')).toBeTruthy();
  });

  it('deletes a single reading and clears all', async () => {
    const History = require('@/app/history').default;
    await wrap(<History />, { ...DEFAULT_STATE, readings: [r('r1'), r('r2')] });
    expect(screen.getByTestId('history-r1')).toBeTruthy();
    await fireEvent.press(screen.getByTestId('delete-r1'));
    expect(screen.queryByTestId('history-r1')).toBeNull();
    expect(screen.getByTestId('history-r2')).toBeTruthy();
    await fireEvent.press(screen.getByTestId('clear-history'));
    expect(screen.getByText('No readings yet')).toBeTruthy();
  });

  it('keeps readings when deletion is cancelled', async () => {
    mockConfirm.mockResolvedValueOnce(false);
    const History = require('@/app/history').default;
    await wrap(<History />, { ...DEFAULT_STATE, readings: [r('r1')] });
    await fireEvent.press(screen.getByTestId('delete-r1'));
    expect(screen.getByTestId('history-r1')).toBeTruthy();
  });
});

describe('reading report', () => {
  it('shows a not-found state for unknown ids', async () => {
    mockParams.current = { id: 'missing' };
    const Reading = require('@/app/reading/[id]').default;
    await wrap(<Reading />);
    expect(screen.getByText('Reading not found')).toBeTruthy();
  });

  it('renders all seven lines for a saved reading', async () => {
    mockParams.current = { id: 'r9' };
    const reading = generatePalmReport({ id: 'r9', createdAt: new Date(), hand: 'left', isDominant: false, answers: { hand_shape: 'fire', heart_end: 'index' } });
    const Reading = require('@/app/reading/[id]').default;
    await wrap(<Reading />, { ...DEFAULT_STATE, readings: [reading] });
    for (const t of ['Life Line', 'Heart Line', 'Head Line', 'Fate Line', 'Success Line', 'Marriage Line', 'Travel Line']) {
      expect(screen.getByText(t)).toBeTruthy();
    }
    expect(screen.getByText('Based on your answers')).toBeTruthy();
  });
});

describe('horoscope tab', () => {
  it('switches periods and signs', async () => {
    const Horoscope = require('@/app/(tabs)/horoscope').default;
    await wrap(<Horoscope />, { ...DEFAULT_STATE, profile: { ...DEFAULT_STATE.profile, signId: 'virgo', onboarded: true } });
    expect(screen.getAllByText(/VIRGO ·/).length).toBeGreaterThan(0);
    await fireEvent.press(screen.getByText('Week'));
    expect(screen.getAllByText(/VIRGO · \w{3} \d+ – /).length).toBeGreaterThan(0);
    await fireEvent.press(screen.getByTestId('horo-sign-pisces'));
    expect(screen.getAllByText(/PISCES ·/).length).toBeGreaterThan(0);
  });
});
