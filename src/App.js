import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handelShowAddFreind() {
    setShowAddFriend((currState) => !currState);
  }
  function handelAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
  }
  function handelSelectedFriend(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handelSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onhandelSelectedFriend={handelSelectedFriend}
          selectedFriend={selectedFriend}
        />
        {showAddFriend && <FormAddFriend onhandelAddFriend={handelAddFriend} />}
        <Button onClick={handelShowAddFreind}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSelectFriend
          selectedFriend={selectedFriend}
          onSplitBill={handelSplitBill}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, onhandelSelectedFriend, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.key}
          onhandelSelectedFriend={onhandelSelectedFriend}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onhandelSelectedFriend, selectedFriend }) {
  const isSelected = friend.id === selectedFriend?.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}€
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}€
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}

      <Button onClick={() => onhandelSelectedFriend(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onhandelAddFriend }) {
  const [name, setName] = useState("");
  const [img, setImg] = useState("https://i.pravatar.cc/48");

  function handelFriend(e) {
    e.preventDefault();
    const id = crypto.randomUUID();
    const newFriend = {
      name,
      img: `${img}?=${id}`,
      id,
      balance: 0,
    };
    onhandelAddFriend(newFriend);
  }
  return (
    <form className="form-add-friend" onSubmit={handelFriend}>
      <label>👫 Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></input>
      <label>🌄 Image URL</label>
      <input
        type="text"
        value={img}
        onChange={(e) => setImg(e.target.value)}
      ></input>
      <Button>Add</Button>
    </form>
  );
}

function FormSelectFriend({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [expenseUser, setExpenseUser] = useState("");
  const expenseFri = bill ? bill - expenseUser : "";
  const [person, setPerson] = useState("user");

  function handelSplit(e) {
    e.preventDefault();

    if (!bill || !expenseUser) return;
    onSplitBill(person === "user" ? expenseFri : -expenseUser);
  }
  return (
    <form class="form-split-bill" onSubmit={handelSplit}>
      <h2>Split a bill with {selectedFriend.name}</h2>
      <label>💰 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      ></input>
      <label>🧍‍♀️ Your expense</label>
      <input
        type="text"
        value={expenseUser}
        onChange={(e) =>
          setExpenseUser(
            Number(e.target.value) > bill ? expenseUser : Number(e.target.value)
          )
        }
      ></input>
      <label>👫 {selectedFriend.name}'s expense</label>
      <input type="text" disabled value={expenseFri}></input>
      <label>🤑 Who is paying the bill</label>
      <select value={person} onChange={(e) => setPerson(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Select</Button>
    </form>
  );
}
