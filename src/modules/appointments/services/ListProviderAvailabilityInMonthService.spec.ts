import AppError from "@shared/errors/AppError";
import FakeAppointmentsRepository from "../repositories/fakes/FakeAppointmentsRepository";
import ListProviderAvailabilityInMonthService from "./ListProviderAvailabilityInMonthService";

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAvailabilityInMonth: ListProviderAvailabilityInMonthService;

describe("ListProvider", () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderAvailabilityInMonth = new ListProviderAvailabilityInMonthService(
      fakeAppointmentsRepository
    );
  });

  it("should be able to list the availability from provider in month", async () => {
    await fakeAppointmentsRepository.create({
      provider_id: "user",
      user_id: "user_id",
      date: new Date(2020, 9, 29, 8, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: "user",
      user_id: "user_id",
      date: new Date(2020, 9, 29, 9, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: "user",
      user_id: "user_id",
      date: new Date(2020, 9, 29, 10, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: "user",
      user_id: "user_id",
      date: new Date(2020, 9, 29, 11, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: "user",
      user_id: "user_id",
      date: new Date(2020, 9, 29, 12, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: "user",
      user_id: "user_id",
      date: new Date(2020, 9, 29, 13, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: "user",
      user_id: "user_id",
      date: new Date(2020, 9, 29, 14, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: "user",
      user_id: "user_id",
      date: new Date(2020, 9, 29, 15, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: "user",
      user_id: "user_id",
      date: new Date(2020, 9, 29, 16, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: "user",
      user_id: "user_id",
      date: new Date(2020, 9, 29, 17, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: "user",
      user_id: "user_id",
      date: new Date(2020, 9, 30, 8, 0, 0),
    });

    const availabilityInMonth = await listProviderAvailabilityInMonth.execute({
      provider_id: "user",
      month: 10,
      year: 2020,
    });

    expect(availabilityInMonth).toEqual(
      expect.arrayContaining([
        { day: 28, availability: true },
        { day: 29, availability: false },
        { day: 30, availability: true },
        { day: 31, availability: true },
      ])
    );
  });
});
