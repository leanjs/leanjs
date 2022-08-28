import { createStore } from "./store";

const { getState, subscribe } = createStore({
  board: {
    user: {
      name: "a",
      nested: {
        a: 1,
      },
    },
    something: {
      else: "",
    },
  },
  banana: 1,
});

describe("new Runtime", () => {
  it("wip", () => {
    const board = getState("board");

    // console.log(`aaaaaa`, board.ref);

    subscribe("board", (value: any) => {
      console.log(`🔥🔥🔥 board`, value);
    });

    subscribe("bananas", (value: any) => {
      console.log(`🔥🔥🔥 bananas`, value);
    });

    subscribe("i-dont-exist", (value: any) => {
      console.log(`🔥🔥🔥 i-dont-exist`, value);
    });

    subscribe("board.user.nested", (value: any) => {
      console.log(`🔥🔥🔥 board.user.nested`, value);
    });

    subscribe("board.something", (value: any) => {
      console.log(`🔥🔥🔥 board.something`, value);
    });

    board.ref = {
      user: {
        name: "bbbbb",
        //id: 1,
        // nested: {
        //   a: 111111,
        // },
        nested: board.ref.user.nested,
      },
    };

    board.ref.user.name = "cccc";

    board.ref.user.nested = { a: 3333333 };
  });
});
