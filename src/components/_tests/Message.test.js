import React from "react";
import { act } from "react-dom/test-utils";
import renderer from "react-test-renderer";
import { render, cleanup } from "@testing-library/react";

import Message from "../Message";

afterEach(cleanup);

it("it renders without crashing", () => {
  render(<Message test={null}></Message>);
});

// it("it renders null", () => {
//   const { getByTestId } = render(
//     <Message
//       createdAt={{
//         nanoseconds: 874000000,
//         seconds: 1652009615,
//       }}
//       text={null}
//       displayName="My Name"
//       photoURL={undefined}
//     ></Message>
//   );
//   expect(getByTestId("message")).toBeNull();
//   // expect
// });

it("it renders correctly", () => {
  const { getByTestId } = render(
    <Message
      createdAt={{
        nanoseconds: 874000000,
        seconds: 1652009615,
      }}
      text="message text"
      displayName="My Name"
      photoURL={undefined}
    ></Message>
  );

  expect(getByTestId("message-text")).toHaveTextContent("message text");
});

it("matches snapshot", () => {
  const tree = renderer
    .create(
      <Message
        createdAt={{
          nanoseconds: 874000000,
          seconds: 1652009615,
        }}
        text="message text"
        displayName="My Name"
        photoURL={undefined}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
