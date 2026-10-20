import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent, { PointerEventsCheckLevel } from "@testing-library/user-event";
import { Header } from "./Header";
import type { AppNotification } from "@entities/notification/model/types";

const user = { name: "Ana Silva", email: "ana.silva@example.com", role: "Administradora" };

// Radix (DropdownMenu, etc.) confia em Pointer Events que o jsdom não
// implementa por completo - desligar a verificação de pointer-events é o
// ajuste padrão para testar estes componentes fora de um browser real.
function setupUser() {
  return userEvent.setup({ pointerEventsCheck: PointerEventsCheckLevel.Never });
}

describe("Header", () => {
  it("mostra o nome e o cargo do utilizador", () => {
    render(<Header user={user} onMenuClick={vi.fn()} />);
    expect(screen.getByText("Ana Silva")).toBeInTheDocument();
    expect(screen.getByText("Administradora")).toBeInTheDocument();
  });

  it("chama onMenuClick ao premir o botão de hambúrguer", async () => {
    const onMenuClick = vi.fn();
    const u = setupUser();
    render(<Header user={user} onMenuClick={onMenuClick} />);
    await u.click(screen.getByRole("button", { name: "Abrir navegação" }));
    expect(onMenuClick).toHaveBeenCalledOnce();
  });

  it("não mostra o contador de não lidas quando não há notificações por ler", () => {
    render(<Header user={user} onMenuClick={vi.fn()} notifications={[]} />);
    const bell = screen.getByRole("button", { name: "Notificações" });
    expect(bell.querySelector("span")).not.toBeInTheDocument();
  });

  it("mostra o número de notificações não lidas junto ao sino", () => {
    const notifications: AppNotification[] = [
      { id: "n1", title: "A", message: "a", createdAt: new Date(), isRead: false },
      { id: "n2", title: "B", message: "b", createdAt: new Date(), isRead: false },
      { id: "n3", title: "C", message: "c", createdAt: new Date(), isRead: true },
    ];
    render(<Header user={user} onMenuClick={vi.fn()} notifications={notifications} />);
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("mostra 9+ quando há mais de 9 notificações não lidas", () => {
    const notifications: AppNotification[] = Array.from({ length: 12 }, (_, i) => ({
      id: `n${i}`,
      title: `T${i}`,
      message: "m",
      createdAt: new Date(),
      isRead: false,
    }));
    render(<Header user={user} onMenuClick={vi.fn()} notifications={notifications} />);
    expect(screen.getByText("9+")).toBeInTheDocument();
  });

  it("abre o menu de notificações e chama onNotificationClick ao escolher uma", async () => {
    const onNotificationClick = vi.fn();
    const notifications: AppNotification[] = [
      { id: "n1", title: "Pedido aprovado", message: "msg", createdAt: new Date(), isRead: false },
    ];
    const u = setupUser();
    render(<Header user={user} onMenuClick={vi.fn()} notifications={notifications} onNotificationClick={onNotificationClick} />);
    await u.click(screen.getByRole("button", { name: "Notificações" }));
    await u.click(await screen.findByText("Pedido aprovado"));
    expect(onNotificationClick).toHaveBeenCalledWith(notifications[0]);
  });

  it("abre o menu de conta e chama onLogout ao escolher 'Terminar sessão'", async () => {
    const onLogout = vi.fn();
    const u = setupUser();
    render(<Header user={user} onMenuClick={vi.fn()} onLogout={onLogout} />);
    await u.click(screen.getByRole("button", { name: "Menu da conta" }));
    await u.click(await screen.findByText("Terminar sessão"));
    expect(onLogout).toHaveBeenCalledOnce();
  });
});
