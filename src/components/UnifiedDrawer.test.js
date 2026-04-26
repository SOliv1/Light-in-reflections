import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import UnifiedDrawer from "./UnifiedDrawer";

jest.mock("./ReflectionsPanel", () => () => <div>Reflections Panel</div>);

class NotificationMock {
  static permission = "default";

  static requestPermission = jest.fn().mockResolvedValue("granted");

  static instances = [];

  constructor(title, options) {
    NotificationMock.instances.push({ title, options });
  }
}

function renderActionsDrawer() {
  return render(
    <UnifiedDrawer
      isOpen
      onClose={jest.fn()}
      season="spring"
      weatherMood="clear"
      veilMode="off"
      onVeilOn={jest.fn()}
      onVeilLift={jest.fn()}
      onVeilOff={jest.fn()}
      orbColor="#8ab4f8"
      initialTab="actions"
    />
  );
}

beforeEach(() => {
  localStorage.clear();
  NotificationMock.permission = "default";
  NotificationMock.requestPermission = jest.fn().mockResolvedValue("granted");
  NotificationMock.instances = [];
  window.Notification = NotificationMock;
});

test("orders actions from highest priority to lowest and keeps completed items last", async () => {
  localStorage.setItem(
    "quietActions",
    JSON.stringify([
      {
        id: 1,
        text: "Least important task",
        priority: "low",
        done: false,
        createdAt: "2026-04-25T09:00:00.000Z",
      },
      {
        id: 2,
        text: "Most important task",
        priority: "highest",
        done: false,
        createdAt: "2026-04-25T08:00:00.000Z",
      },
      {
        id: 3,
        text: "Completed task",
        priority: "highest",
        done: true,
        createdAt: "2026-04-25T10:00:00.000Z",
      },
    ])
  );

  renderActionsDrawer();

  const items = await waitFor(() => within(screen.getByRole("list")).getAllByRole("listitem"));

  expect(items[0]).toHaveTextContent("Most important task");
  expect(items[1]).toHaveTextContent("Least important task");
  expect(items[2]).toHaveTextContent("Completed task");
});

test("requests browser notification permission from the actions drawer", async () => {
  renderActionsDrawer();

  fireEvent.click(screen.getByRole("button", { name: /allow reminders/i }));

  await waitFor(() => expect(NotificationMock.requestPermission).toHaveBeenCalledTimes(1));
});

test("adds a priority action with reminder metadata", async () => {
  NotificationMock.permission = "granted";
  renderActionsDrawer();

  fireEvent.change(screen.getByPlaceholderText(/gentle intention/i), {
    target: { value: "Call florist" },
  });
  fireEvent.change(screen.getByLabelText(/^priority$/i), {
    target: { value: "highest" },
  });
  fireEvent.change(screen.getByLabelText(/^reminder$/i), {
    target: { value: "off" },
  });
  fireEvent.click(screen.getByRole("button", { name: /^add$/i }));

  const actionRow = await screen.findByText("Call florist");
  expect(actionRow).toBeInTheDocument();
  expect(actionRow.closest("li").querySelector(".priority-pill")).toHaveTextContent("Most important");

  const savedActions = JSON.parse(localStorage.getItem("quietActions"));
  expect(savedActions[0]).toMatchObject({
    text: "Call florist",
    priority: "highest",
    reminderEnabled: false,
    reminderMinutes: null,
  });
});
