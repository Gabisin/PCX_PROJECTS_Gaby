import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NotificationsProvider, useNotifications } from "./NotificationsProvider";
import { MOCK_NOTIFICATIONS } from "./mock";

function Probe() {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const unread = notifications.filter((n) => !n.isRead);
  return (
    <div>
      <p>não lidas: {unread.length}</p>
      <button onClick={() => markAsRead(notifications[0].id)}>marcar a primeira como lida</button>
      <button onClick={markAllAsRead}>marcar todas como lidas</button>
    </div>
  );
}

describe("NotificationsProvider / useNotifications", () => {
  it("arranca semeado com MOCK_NOTIFICATIONS", () => {
    const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.isRead).length;
    render(
      <NotificationsProvider>
        <Probe />
      </NotificationsProvider>
    );
    expect(screen.getByText(`não lidas: ${unreadCount}`)).toBeInTheDocument();
  });

  it("markAsRead marca só a notificação indicada, sem afectar as restantes", async () => {
    render(
      <NotificationsProvider>
        <Probe />
      </NotificationsProvider>
    );
    const before = MOCK_NOTIFICATIONS.filter((n) => !n.isRead).length;
    await userEvent.click(screen.getByRole("button", { name: "marcar a primeira como lida" }));
    expect(screen.getByText(`não lidas: ${before - 1}`)).toBeInTheDocument();
  });

  it("markAllAsRead marca todas como lidas de uma vez", async () => {
    render(
      <NotificationsProvider>
        <Probe />
      </NotificationsProvider>
    );
    await userEvent.click(screen.getByRole("button", { name: "marcar todas como lidas" }));
    expect(screen.getByText("não lidas: 0")).toBeInTheDocument();
  });

  it("useNotifications fora do Provider lança um erro claro", () => {
    expect(() => render(<Probe />)).toThrow("useNotifications deve ser usado dentro de <NotificationsProvider>");
  });
});
