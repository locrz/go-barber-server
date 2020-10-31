import FakeAppointmentsRepository from "../repositories/fakes/FakeAppointmentsRepository";
import ListProviderAvailabilityInDayService from "./ListProviderAvailabilityInDayService";

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAvailabilityInDay: ListProviderAvailabilityInDayService;

describe("ListProviderAvailabilityInDay", () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderAvailabilityInDay = new ListProviderAvailabilityInDayService(
      fakeAppointmentsRepository
    );
  });

  it("should be able to list availability in day from provider", async () => {
    await fakeAppointmentsRepository.create({
      provider_id: "provider",
      date: new Date(2020, 10, 25, 13, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: "provider",
      date: new Date(2020, 10, 25, 15, 0, 0),
    });

    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      const customDate = new Date(2020, 10, 25, 12);
      return customDate.getTime();
    });

    const availability = await listProviderAvailabilityInDay.execute({
      provider_id: "provider",
      day: 25,
      month: 11,
      year: 2020,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 11, available: false },
        { hour: 12, available: false },
        { hour: 13, available: false },
        { hour: 14, available: true },
        { hour: 15, available: false },
        { hour: 16, available: true },
      ])
    );
  });
});
