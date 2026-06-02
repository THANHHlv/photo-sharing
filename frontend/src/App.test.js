import { render, screen } from "@testing-library/react";
import App from "./App";

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: false,
      status: 401,
      text: async () => "Unauthorized",
      json: async () => ({}),
      headers: { get: () => "" },
    }),
  );
});

test("renders top bar title", async () => {
  render(<App />);
  expect(await screen.findByText(/Thành Lê/i)).toBeInTheDocument();
});
