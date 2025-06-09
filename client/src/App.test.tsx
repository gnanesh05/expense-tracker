import { render } from '@testing-library/react';
import { test } from 'vitest'
import App from './App';

test('App Mounts without crashing', () => {
   const { unmount } = render(<App />);
   unmount();
});
