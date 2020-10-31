import FakeAppointmentsRepository from "../repositories/fakes/FakeAppointmentsRepository";
import ListProviderAppointmentsService from "./ListProviderAppointmentsService";

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointments: ListProviderAppointmentsService;

describe("ListProviderAppointments", () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderAppointments = new ListProviderAppointmentsService(
      fakeAppointmentsRepository
    );
  });

  it("should be able to list availability in day from provider", async () => {
    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id: "provider",
      user_id: "111111",
      date: new Date(2020, 10, 25, 13, 0, 0),
    });

    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id: "provider",
      user_id: "111111",
      date: new Date(2020, 10, 25, 15, 0, 0),
    });

    const providerAppointments = await listProviderAppointments.execute({
      provider_id: "provider",
      day: 25,
      month: 11,
      year: 2020,
    });

    expect(providerAppointments).toEqual([appointment1, appointment2]);
  });
});
