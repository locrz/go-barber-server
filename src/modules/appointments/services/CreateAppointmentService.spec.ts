import AppError from "@shared/errors/AppError";
import FakeAppointmentsRepository from "../repositories/fakes/FakeAppointmentsRepository";
import CreateAppointmentService from "./CreateAppointmentService";
import FakeNotificationsRepository from "@modules/notifications/repositories/fakes/FakeNotificationsRepository";
import FakeCacheProvider from "@shared/container/providers/CacheProvider/fakes/FakeCacheProvider";

let fakeAppointmentRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;
let createAppointmentService: CreateAppointmentService;

describe("CreateAppointment", () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentRepository,
      fakeNotificationsRepository,
      fakeCacheProvider
    );
  });

  it("should be able to create a new appointment", async () => {
    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      const customDate = new Date(2020, 10, 25, 10);
      return customDate.getTime();
    });

    const appointment = await createAppointmentService.execute({
      date: new Date(2020, 10, 25, 11),
      user_id: "user_id",
      provider_id: "provider_id",
    });

    expect(appointment).toHaveProperty("id");
    expect(appointment.provider_id).toBe("provider_id");
  });

  it("should not be able to create a new appointment on the same hour", async () => {
    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      const customDate = new Date(2020, 10, 25, 10);
      return customDate.getTime();
    });

    const appointmentDate = new Date(2020, 10, 25, 11);

    await createAppointmentService.execute({
      date: appointmentDate,
      provider_id: "provider_id",
      user_id: "user_id",
    });

    await expect(
      createAppointmentService.execute({
        date: appointmentDate,
        provider_id: "provider_id",
        user_id: "user_id",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create a new appointment on a past date", async () => {
    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      const customDate = new Date(2020, 10, 25, 10);
      return customDate.getTime();
    });

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 10, 25, 9),
        provider_id: "user_id",
        user_id: "user_id",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create a new appointment when provider and user are the same", async () => {
    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      const customDate = new Date(2020, 10, 25, 10);
      return customDate.getTime();
    });

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 10, 25, 11),
        provider_id: "user_id",
        user_id: "user_id",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create a new appointment before 8am and after 5pm", async () => {
    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      const customDate = new Date(2020, 10, 25, 10);
      return customDate.getTime();
    });

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 10, 25, 7),
        provider_id: "provider_id",
        user_id: "user_id",
      })
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 10, 25, 18),
        provider_id: "provider_id",
        user_id: "user_id",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
