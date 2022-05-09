import React from "react";
import { act } from "react-dom/test-utils";
import renderer from "react-test-renderer";
import { render, cleanup, screen } from "@testing-library/react";

//
import * as firebaseFunction from "react-firebase-hooks/auth";
//
import App from "../App";

afterEach(cleanup);

it("renders app", () => {
  render(<App />);
});

it("matches snapshot", () => {
  const tree = renderer.create(<App />).toJSON();
  expect(tree).toMatchSnapshot();
});

it("render with error", () => {
  const { getByTestId } = render(<App />);
  expect(screen.queryByTestId("error")).not.toBeInTheDocument();
});

test("errors", () => {
  const spy = jest
    .spyOn(firebaseFunction, "useAuthState")
    .mockImplementationOnce(() => [null, false, true]);

  const { getByTestId } = render(<App />);
  expect(getByTestId("error")).toBeInTheDocument();

  spy.mockRestore();
});

// test("channel", () => {
//   const spy = jest
//     .spyOn(firebaseFunction, "useAuthState")
//     .mockImplementationOnce(() => [
//       { auth: { displayName: "name" } },
//       false,
//       false,
//     ]);

//   // it("render with error", () => {
//   const { getByTestId } = render(<App />);
//   expect(getByTestId("channel")).toBeInTheDocument();
//   // });
//   spy.mockRestore();
// });

// it("sigount", () => {
//   render(<App />);
//   expect(screen.getByTestId("signout")).toBeInTheDocument();
// });
