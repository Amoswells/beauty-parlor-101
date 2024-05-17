import {
  query,
  update,
  text,
  Record,
  StableBTreeMap,
  Variant,
  Vec,
  None,
  Some,
  Ok,
  Err,
  ic,
  Principal,
  Opt,
  nat64,
  Result,
  Canister,
} from "azle";

import { v4 as uuidv4 } from "uuid";

const Service = Record({
  id: text,
  name: text,
  description: text,
  price: text,
});

const ServicePayload = Record({
  name: text,
  description: text,
  price: text,
});

const Client = Record({
  id: text,
  principal: Principal,
  name: text,
  phoneNo: text,
  email: text,
  address: text,
  appointment: Vec(text),
});

const ClientPayload = Record({
  name: text,
  phoneNo: text,
  email: text,
  address: text,
});

const Professional = Record({
  id: text,
  principal: Principal,
  name: text,
  phoneNo: text,
  email: text,
  address: text,
  appointments: Vec(text),
});

const ProfessionalPayload = Record({
  name: text,
  phoneNo: text,
  email: text,
  address: text,
});

const Status = Variant({
  Pending: text,
  Completed: text,
  Cancelled: text,
});

const Booking = Record({
  id: text,
  serviceId: text,
  clientId: text,
  time: text,
});

const BookingPayload = Record({
  serviceId: text,
  clientId: text,
  time: text,
});

const AppointmentInfo = Record({
  appointmentId: text,
  created_at: nat64,
  serviceId: text,
  clientId: text,
  clientName: text,
  clientPhoneNo: text,
  serviceName: text,
  time: text,
});

const Error = Variant({
  NotFound: text,
  InvalidPayload: text,
});

const ServicesStorage = StableBTreeMap(0, text, Service);
const ClientsStorage = StableBTreeMap(1, text, Client);
const ProfessionalsStorage = StableBTreeMap(2, text, Professional);
const AppointmentsStorage = StableBTreeMap(3, text, AppointmentInfo);

export default Canister({
  createService: update([ServicePayload], Result(Service, Error), (payload) => {
    const service = {
      id: uuidv4(),
      ...payload,
    };
    ServicesStorage.insert(service.id, service);
    return Ok(service);
  }),

  getServices: query([], Vec(Service), () => {
    return ServicesStorage.values();
  }),

  getService: query([text], Opt(Service), (id) => {
    return ServicesStorage.get(id);
  }),

  createClient: update([ClientPayload], Result(Client, Error), (payload) => {
    const client = {
      id: uuidv4(),
      principal: ic.caller(),
      appointment: [],
      ...payload,
    };

    ClientsStorage.insert(client.id, client);
    return Ok(client);
  }),

  getClients: query([], Vec(Client), () => {
    return ClientsStorage.values();
  }),

  getClientByPrincipal: query([], Result(Client, Error), () => {
    const principal = ic.caller();
    const clientOpt = ClientsStorage.values().filter((client) => {
      return client.principal.toText() === principal.toText();
    });

    if (clientOpt.length === 0) {
      return Err({
        NotFound: `Client with principal ${principal} not found`,
      });
    }
    return Ok(clientOpt[0]);
  }),

  getClient: query([text], Opt(Client), (id) => {
    return ClientsStorage.get(id);
  }),

  createProfessional: update(
    [ProfessionalPayload],
    Result(Professional, Error),
    (payload) => {
      const professional = {
        id: uuidv4(),
        principal: ic.caller(),
        appointments: [],
        ...payload,
      };

      ProfessionalsStorage.insert(professional.id, professional);
      return Ok(professional);
    }
  ),

  getProfessionals: query([], Vec(Professional), () => {
    return ProfessionalsStorage.values();
  }),

  getProfessional: query([text], Opt(Professional), (id) => {
    return ProfessionalsStorage.get(id);
  }),

  getProfessionalByPrincipal: query([], Result(Professional, Error), () => {
    const principal = ic.caller();
    const professionalOpt = ProfessionalsStorage.values().filter(
      (professional) => {
        return professional.principal.toText() === principal.toText();
      }
    );

    if (professionalOpt.length === 0) {
      return Err({
        NotFound: `Professional with principal ${principal} not found`,
      });
    }
    return Ok(professionalOpt[0]);
  }),

  bookAppointment: update(
    [BookingPayload],
    Result(AppointmentInfo, Error),
    (payload) => {
      const clientOpt = ClientsStorage.get(payload.clientId);
      if ("None" in clientOpt) {
        return Err({
          NotFound: `Client with ID ${payload.clientId} not found`,
        });
      }

      const serviceOpt = ServicesStorage.get(payload.serviceId);
      if ("None" in serviceOpt) {
        return Err({
          NotFound: `Service with ID ${payload.serviceId} not found`,
        });
      }
      const client = clientOpt.Some;
      const service = serviceOpt.Some;
      const booking = {
        id: uuidv4(),
        clientId: client.id,
        serviceId: service.id,
        time: payload.time,
      };

      const appointment = {
        appointmentId: booking.id,
        created_at: ic.time(),
        serviceId: booking.serviceId,
        clientId: booking.clientId,
        time: booking.time,
        serviceName: service.name,
        clientName: client.name,
        clientPhoneNo: client.phoneNo,
      };

      ClientsStorage.insert(client.id, {
        ...client,
        appointment: [appointment.appointmentId],
      });

      AppointmentsStorage.insert(appointment.appointmentId, appointment);

      return Ok(appointment);
    }
  ),

  getAppointments: query([], Vec(AppointmentInfo), () => {
    return AppointmentsStorage.values();
  }),

  getAppointment: query([text], Opt(AppointmentInfo), (id) => {
    return AppointmentsStorage.get(id);
  }),
});

globalThis.crypto = {
  // @ts-ignore
  getRandomValues: () => {
    let array = new Uint8Array(32);

    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }

    return array;
  },
};
