import React from "react";
import { act } from "react-dom/test-utils";
import renderer from "react-test-renderer";
import { render, cleanup, screen, waitFor } from "@testing-library/react";
import { wrapper, shallow } from "enzyme";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import * as firebaseFunctions from "firebase/auth";
import Auth, * as AuthFunc from "../Auth";
import userEvent from "@testing-library/user-event";

Enzyme.configure({ adapter: new Adapter() });

afterEach(cleanup);

it("it renders", () => {
  render(<Auth />);
});

it("it renders w props", () => {
  render(<Auth auth={{}} db={{}} />);
});

// it("it renders error", () => {
//   const { getByTestId } = render(<Auth />);
//   expect(getByTestId("error")).not.toBeNull();
// });

it("it renders login", () => {
  const { getByTestId } = render(<Auth />);
  expect(getByTestId("login")).not.toBeNull();
  expect(screen.queryByTestId("reset")).not.toBeInTheDocument();
  expect(screen.getByTestId("toReg-id")).toBeInTheDocument();
  // expect(screen.getByTestId("reg")).not.toBeInTheDocument();
});

it("it renders not reset", () => {
  const { getByTestId } = render(<Auth />);
  expect(screen.queryByTestId("reset")).not.toBeInTheDocument();
});

it("it renders not reg", () => {
  const { getByTestId } = render(<Auth />);
  expect(getByTestId("login")).not.toBeNull();
  expect(screen.queryByTestId("reg")).not.toBeInTheDocument();
  // expect(screen.getByTestId("reg")).not.toBeInTheDocument();
});

it("render reg", async () => {
  render(<Auth />);
  userEvent.click(screen.getByTestId("toReg-id"));
  await waitFor(() => expect(screen.getByTestId("reg")).toBeInTheDocument());
});

it("render reset", async () => {
  render(<Auth />);
  userEvent.click(screen.getByTestId("toReset-id"));
  await waitFor(() => expect(screen.getByTestId("reset")).toBeInTheDocument());
});

it("back to login from reset", async () => {
  render(<Auth />);
  userEvent.click(screen.getByTestId("toReset-id"));
  await waitFor(() => expect(screen.getByTestId("reset")).toBeInTheDocument());
  userEvent.click(screen.getByTestId("toLogin-id"));
  await waitFor(() => expect(screen.getByTestId("login")).toBeInTheDocument());
});

it("back to login from reg", async () => {
  render(<Auth />);
  userEvent.click(screen.getByTestId("toReg-id"));
  await waitFor(() => expect(screen.getByTestId("reg")).toBeInTheDocument());
  userEvent.click(screen.getByTestId("toLogin-id"));
  await waitFor(() =>
    expect(screen.queryByTestId("login")).toBeInTheDocument()
  );
});

it("matches snapshot", () => {
  const tree = renderer.create(<Auth />).toJSON();
  expect(tree).toMatchSnapshot();
});

it("login", () => {
  render(<Auth />);
  userEvent.click(screen.getByTestId("toReg-id"));
});

// test("function testing", () => {
//   const wrapper = shallow(<Auth />);
//   wrapper.instance().logInWithEmailAndPassword();
//   // expect(t).toThrowError();
// });

test("funct call reg", async () => {
  const r = await AuthFunc.register();
  expect(r).toBe(undefined);
});

test("funct reset", async () => {
  const r = await AuthFunc.sendPasswordReset();
  expect(r).toBe(undefined);
});

test("funct reg", async () => {
  const r = await AuthFunc.registerWithEmailAndPassword();
  expect(r).toBe(undefined);
});

test("funct login", async () => {
  const r = await AuthFunc.logInWithEmailAndPassword();
  expect(r).toBe(undefined);
});
test("funct google", async () => {
  const r = await AuthFunc.signInGoogle();
  expect(r).toBe(undefined);
});

// test("register full", async () => {
//   const spy = jest
//     .spyOn(firebaseFunctions, "createUserWithEmailAndPassword")
//     .mockImplementationOnce(() => undefined);
//   const r = await AuthFunc.registerWithEmailAndPassword();
//   expect(r).toBe(undefined);
//   // const { getByTestId } = render(<App />);
//   // expect(getByTestId("error")).toBeInTheDocument();

//   spy.mockRestore();
// });
