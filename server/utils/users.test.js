const expect = require("expect");
const { Users } = require("./users");

describe("Users", function() {
  let users;

  beforeEach(function() {
    users = new Users();
    users.users = [
      {
        id: "1",
        name: "Ichi",
        room: "Raum"
      },
      {
        id: "2",
        name: "Ni",
        room: "Room"
      },
      {
        id: "3",
        name: "San",
        room: "Raum"
      }
    ];
  });

  it("should add new user", function() {
    const users = new Users();
    const user = {
      id: "123",
      name: "John",
      room: "The Nyan Nyans"
    };
    const resUser = users.addUser(user.id, user.name, user.room);

    expect(users.users).toEqual([user]);
    expect(resUser).toEqual(user);
  });

  it("should return names for 'Raum' room", function() {
    const userList = users.getUserList("Raum");

    expect(userList).toEqual(["Ichi", "San"]);
  });

  it("should remove a user", function() {
    const userId = "1";
    const user = users.removeUser(userId);

    expect(user.id).toBe(userId);
    expect(users.users.length).toBe(2);
  });

  it("should not remove a user", function() {
    const userId = "99";
    const user = users.removeUser(userId);

    expect(user).toNotExist();
    expect(users.users.length).toBe(3);
  });

  it("should find user", function() {
    const userId = "2";
    const user = users.getUser(userId);

    expect(user.id).toBe(userId);
  });

  it("should not find user", function() {
    const userId = "99";
    const user = users.getUser(userId);

    expect(user).toNotExist();
  });
});
