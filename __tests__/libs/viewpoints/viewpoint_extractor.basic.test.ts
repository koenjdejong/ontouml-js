import { Project, Diagram } from '@libs/ontouml';
import { ViewpointExtractor } from '@libs/viewpoints';

describe('Basic viewpoint example', () => {
  const project = new Project();
  const model = project.createModel();

  // Kinds
  const k_ship = model.createKind('Ship')
  const k_person = model.createKind('Person')
  const k_organization = model.createKind('Organization')
  const k_harbor = model.createKind('Harbor')

  // SubKinds
  const sk_cargoShip = model.createSubkind('CargoShip')
  const sk_passengerShip = model.createSubkind('PassengerShip')

  const gn_cargoShip = model.createGeneralization(k_ship, sk_cargoShip, 'gn_cargoShip')
  const gn_passengerShip = model.createGeneralization(k_ship, sk_passengerShip, 'gn_passengerShip')

  const gs_shipGeneralizationSet = model.createGeneralizationSet([gn_cargoShip, gn_passengerShip], true, false)

  // Phases
  const p_activeHarbor = model.createPhase('ActiveHarbor')
  const p_extinctHarbor = model.createPhase('ExtinctHarbor')
  const p_temporallyClosedHarbor = model.createPhase('TemporallyClosedHarbor')

  const gn_activeHarbor = model.createGeneralization(k_harbor, p_activeHarbor, 'gn_activeHarbor')
  const gn_extinctHarbor = model.createGeneralization(k_harbor, p_extinctHarbor, 'gn_extinctHarbor')
  const gn_temporallyClosedHarbor = model.createGeneralization(k_harbor, p_temporallyClosedHarbor, 'gn_temporallyClosedHarbor')

  const gs_harborGeneralizationSet = model.createGeneralizationSet([gn_activeHarbor, gn_extinctHarbor, gn_temporallyClosedHarbor], true, false)

  // Roles
  const r_individualAdministrator = model.createRole('IndividualAdministrator')
  const r_passenger = model.createRole('Passenger')
  const r_captain = model.createRole('Captain')

  const gn_individualAdministrator = model.createGeneralization(k_person, r_individualAdministrator, 'gn_individualAdministrator')
  const gn_passenger = model.createGeneralization(k_person, r_passenger, 'gn_passenger')
  const gn_captain = model.createGeneralization(k_person, r_captain, 'gn_captain')

  const gs_personRoleGeneralizationSet = model.createGeneralizationSet([gn_individualAdministrator, gn_passenger, gn_captain], true, false)

  const r_corporateAdministrator = model.createRole('CorporateAdministrator')
  const r_corporteCargoClient = model.createRole('CorporteCargoClient')

  const gn_corporateAdministrator = model.createGeneralization(k_organization, r_corporateAdministrator, 'gn_corporateAdministrator')
  const gn_corporteCargoClient = model.createGeneralization(k_organization, r_corporteCargoClient, 'gn_corporteCargoClient')

  const gs_corporateRoleGeneralizationSet = model.createGeneralizationSet([gn_corporateAdministrator, gn_corporteCargoClient], true, false)

  const r_travellingShip = model.createRole('TravellingShip')
  const r_managedShip = model.createRole('ManagedShip')
  const r_captainAssignedShip = model.createRole('CaptainAssignedShip')

  const gn_travellingShip = model.createGeneralization(k_ship, r_travellingShip, 'gn_travellingShip')
  const gn_managedShip = model.createGeneralization(k_ship, r_managedShip, 'gn_managedShip')
  const gn_captainAssignedShip = model.createGeneralization(k_ship, r_captainAssignedShip, 'gn_captainAssignedShip')

  const gs_shipRoleGeneralizationSet = model.createGeneralizationSet([gn_travellingShip, gn_managedShip, gn_captainAssignedShip], true, false)

  const r_destinationHarbor = model.createRole('DestinationHarbor')
  const r_departingHarbor = model.createRole('DepartingHarbor')

  const gn_destinationHarbor = model.createGeneralization(p_activeHarbor, r_destinationHarbor, 'gn_destinationHarbor')
  const gn_departingHarbor = model.createGeneralization(p_activeHarbor, r_departingHarbor, 'gn_departingHarbor')

  const gs_harborRoleGeneralizationSet = model.createGeneralizationSet([gn_destinationHarbor, gn_departingHarbor], true, false)

  // RoleMixin
  const rm_shipAdmininstrator = model.createRoleMixin('ShipAdmininstrator')

  const gn_corporateAdministratorAdm = model.createGeneralization(rm_shipAdmininstrator, r_corporateAdministrator, 'gn_corporateAdministratorAdm')
  const gn_individualAdministratorAdm = model.createGeneralization(rm_shipAdmininstrator, r_individualAdministrator, 'gn_individualAdministratorAdm')

  const rm_transportationContractClient = model.createRoleMixin('TransportationContractClient')

  const gn_corporateCargoClientClient = model.createGeneralization(rm_transportationContractClient, r_corporteCargoClient, 'gn_corporateCargoClientClient')
  const gn_cpassengerClient = model.createGeneralization(rm_transportationContractClient, r_passenger, 'gn_cpassengerClient')

  // Relators
  const rl_trip = model.createRelator('Trip')

  const md_trip_departing = model.createMediationRelation(rl_trip, r_departingHarbor, 'md_trip_departing')
  const md_trip_destination = model.createMediationRelation(rl_trip, r_destinationHarbor, 'md_trip_destination')
  const md_trip_travelling = model.createMediationRelation(rl_trip, r_travellingShip, 'md_trip_travelling')

  const rl_captainDesignation = model.createRelator('CaptainDesigntion')

  const md_designation_captain = model.createMediationRelation(rl_captainDesignation, r_captain, 'md_designation_captain')
  const md_designation_assigned = model.createMediationRelation(rl_captainDesignation, r_captainAssignedShip, 'md_designation_assigned')

  const rl_shipAdministration = model.createRelator('ShipAdministration')

  const md_administration_managed = model.createMediationRelation(rl_shipAdministration, r_managedShip, 'md_administration_managed')
  const md_administration_administrator = model.createMediationRelation(rl_shipAdministration, rm_shipAdmininstrator, 'md_administration_administrator')

  const rl_transportationContract = model.createRelator('TransportationContract')

  const md_contract_administration = model.createMediationRelation(rl_transportationContract, rl_shipAdministration, 'md_contract_administration')
  const md_contract_client = model.createMediationRelation(rl_transportationContract, rm_transportationContractClient, 'md_contract_client')

  let diagrams: Diagram[] = new ViewpointExtractor(project).buildAll();

  

  describe('Kind View', () => {
    let diagram: Diagram = diagrams.find(d => d.getName() === 'Kind View');

    it('Should contain the expected classes (4)', () => {
      expect(diagram.findView(k_harbor)).toBeTruthy();
      expect(diagram.findView(k_organization)).toBeTruthy();
      expect(diagram.findView(k_person)).toBeTruthy();
      expect(diagram.findView(k_ship)).toBeTruthy();
      expect(diagram.getClassViews()).toHaveLength(4);
    });

  });

  describe('SubKind View', () => {
    let diagram: Diagram = diagrams.find(d => d.getName() === 'SubKind View');

    it('Should contain the expected classes (3)', () => {
      expect(diagram.findView(sk_passengerShip)).toBeTruthy();
      expect(diagram.findView(sk_cargoShip)).toBeTruthy();
      expect(diagram.findView(k_ship)).toBeTruthy();
      expect(diagram.getClassViews()).toHaveLength(3);
    });

    it('Should contain the expected generalizations (2)', () => {
      expect(diagram.findView(gn_cargoShip)).toBeTruthy();
      expect(diagram.findView(gn_passengerShip)).toBeTruthy();
      expect(diagram.getGeneralizationViews()).toHaveLength(2);
    })

    it('Should contain ancestors of subkind class: «subkind» Cargo Ship', () => {
      expect(diagram.findView(k_ship)).toBeTruthy();
    });

    it('Should contain ancestors of subkind class: «subkind» Passenger Ship', () => {
      expect(diagram.findView(k_ship)).toBeTruthy();
    });
  });

  describe('Phase View', () => {
    let diagram: Diagram = diagrams.find(d => d.getName() === 'Phase View');

    it('Should contain the expected classes (4)', () => {
      expect(diagram.findView(p_activeHarbor)).toBeTruthy();
      expect(diagram.findView(p_extinctHarbor)).toBeTruthy();
      expect(diagram.findView(p_temporallyClosedHarbor)).toBeTruthy();
      expect(diagram.findView(k_harbor)).toBeTruthy();
      expect(diagram.getClassViews()).toHaveLength(4);
    });

    it('Should contain the expected generalizations (3)', () => {
      expect(diagram.findView(gn_activeHarbor)).toBeTruthy();
      expect(diagram.findView(gn_extinctHarbor)).toBeTruthy();
      expect(diagram.findView(gn_temporallyClosedHarbor)).toBeTruthy();
      expect(diagram.getGeneralizationViews()).toHaveLength(3);
    })

    it('Should contain ancestors of phase class: «phase» Active Harbor', () => {
      expect(diagram.findView(k_harbor)).toBeTruthy();
    });

    it('Should contain ancestors of phase class: «phase» Extinct Harbor', () => {
      expect(diagram.findView(k_harbor)).toBeTruthy();
    });

    it('Should contain ancestors of phase class: «phase» Temporarily Closed Harbor', () => {
      expect(diagram.findView(k_harbor)).toBeTruthy();
    });
  });


  describe('Role View', () => {
    let diagram: Diagram = diagrams.find(d => d.getName() === 'Role View');

    it('Should contain the expected classes (15)', () => {
      expect(diagram.findView(r_individualAdministrator)).toBeTruthy();
      expect(diagram.findView(r_captain)).toBeTruthy();
      expect(diagram.findView(r_passenger)).toBeTruthy();
      expect(diagram.findView(k_person)).toBeTruthy();
      expect(diagram.findView(r_corporateAdministrator)).toBeTruthy()
      expect(diagram.findView(r_corporteCargoClient)).toBeTruthy()
      expect(diagram.findView(k_organization)).toBeTruthy()
      expect(diagram.findView(r_travellingShip)).toBeTruthy()
      expect(diagram.findView(r_managedShip)).toBeTruthy()
      expect(diagram.findView(r_captainAssignedShip)).toBeTruthy()
      expect(diagram.findView(k_ship)).toBeTruthy()
      expect(diagram.findView(r_destinationHarbor)).toBeTruthy()
      expect(diagram.findView(r_departingHarbor)).toBeTruthy()
      expect(diagram.findView(p_activeHarbor)).toBeTruthy()
      expect(diagram.findView(k_harbor)).toBeTruthy()
      expect(diagram.getClassViews()).toHaveLength(15);
    });

    it('Should contain the expected generalizations (11)', () => {
      expect(diagram.findView(gn_individualAdministrator)).toBeTruthy();
      expect(diagram.findView(gn_captain)).toBeTruthy();
      expect(diagram.findView(gn_passenger)).toBeTruthy();
      expect(diagram.findView(gn_corporateAdministrator)).toBeTruthy();
      expect(diagram.findView(gn_corporteCargoClient)).toBeTruthy();
      expect(diagram.findView(gn_travellingShip)).toBeTruthy();
      expect(diagram.findView(gn_managedShip)).toBeTruthy();
      expect(diagram.findView(gn_captainAssignedShip)).toBeTruthy();
      expect(diagram.findView(gn_destinationHarbor)).toBeTruthy();
      expect(diagram.findView(gn_departingHarbor)).toBeTruthy();
      expect(diagram.findView(gn_activeHarbor)).toBeTruthy();
   
      expect(diagram.getGeneralizationViews()).toHaveLength(11);
    })

    it('Should contain ancestors of role class: «role» Individual Administrator', () => {
      expect(diagram.findView(k_person)).toBeTruthy();
    });

    it('Should contain ancestors of role class: «role» Captain', () => {
      expect(diagram.findView(k_person)).toBeTruthy();
    });

    it('Should contain ancestors of role class: «role» Passenger', () => {
      expect(diagram.findView(k_person)).toBeTruthy();
    });

    it('Should contain ancestors of role class: «role» Corporate Administrator', () => {
      expect(diagram.findView(k_organization)).toBeTruthy();
    });

    it('Should contain ancestors of role class: «role» Corporate Cargo Client', () => {
      expect(diagram.findView(k_organization)).toBeTruthy();
    });

    it('Should contain ancestors of role class: «role» Travelling Ship', () => {
      expect(diagram.findView(k_ship)).toBeTruthy();
    });

    it('Should contain ancestors of role class: «role» Manage Ship', () => {
      expect(diagram.findView(k_ship)).toBeTruthy();
    });

    it('Should contain ancestors of role class: «role» Captain Assigner Ship', () => {
      expect(diagram.findView(k_ship)).toBeTruthy();
    });

    it('Should contain ancestors of role class: «role» Destination Harbor', () => {
      expect(diagram.findView(p_activeHarbor)).toBeTruthy();
      expect(diagram.findView(k_harbor)).toBeTruthy();
    });

    it('Should contain ancestors of role class: «role» Departing Harbor', () => {
      expect(diagram.findView(p_activeHarbor)).toBeTruthy();
      expect(diagram.findView(k_harbor)).toBeTruthy();
    });

  });

  describe('Relator View', () => {
    let diagram: Diagram;

    beforeAll(() => {
      diagram = diagrams.find(d => d.getName() === 'Relator View');
    });

    it('Should contain the main relator: Transportation Contract', () => {
      expect(diagram.findView(rl_transportationContract)).toBeTruthy();
    });

    it('Should contain classes mediated by the Transportation Contract relator', () => {
      expect(diagram.findView(rm_transportationContractClient)).toBeTruthy();
      expect(diagram.findView(rl_shipAdministration)).toBeTruthy();
    });

    it('Should contain the main relator: Ship Administration', () => {
      expect(diagram.findView(rl_shipAdministration)).toBeTruthy();
    });

    it('Should contain classes mediated by the Ship Administration relator', () => {
      expect(diagram.findView(rm_shipAdmininstrator)).toBeTruthy();
      expect(diagram.findView(r_managedShip)).toBeTruthy();
    });

    it('Should contain the main relator: Trip', () => {
      expect(diagram.findView(rl_trip)).toBeTruthy();
    });

    it('Should contain classes mediated by the Trip relator', () => {
      expect(diagram.findView(r_travellingShip)).toBeTruthy();
      expect(diagram.findView(r_destinationHarbor)).toBeTruthy();
      expect(diagram.findView(r_departingHarbor)).toBeTruthy();
    });

    it('Should contain the main relator: Captain Designation', () => {
      expect(diagram.findView(rl_captainDesignation)).toBeTruthy();
    });

    it('Should contain classes mediated by the Captain Designation relator', () => {
      expect(diagram.findView(r_captain)).toBeTruthy();
      expect(diagram.findView(r_captainAssignedShip)).toBeTruthy();
    });

    it('Should contain 12 shapes (classes)', () => {
      expect(diagram.getClassViews()).toHaveLength(12);
    });

    it('Should contain 9 relations views', () => {
      expect(diagram.getRelationViews()).toHaveLength(9);
    });

    
  });

  describe('Non Sortal View', () => {
    let diagram: Diagram;

    beforeAll(() => {
      diagram = diagrams.find(d => d.getName() === 'Non Sortal View');
    });

    it('Should contain the non sortal: Ship Administrator', () => {
      expect(diagram.findView(rm_shipAdmininstrator)).toBeTruthy();
    });

    it('Should contain descendants of non sortal class: «role mixin» Ship Administrator', () => {
      expect(diagram.findView(r_corporateAdministrator)).toBeTruthy();
      expect(diagram.findView(r_individualAdministrator)).toBeTruthy();
    });

    it('Should contain ancestors of sortal class: «role» Corporate Administrator', () => {
      expect(diagram.findView(k_organization)).toBeTruthy();   
    });

    it('Should contain ancestors of sortal class: «role» Individual Administrator', () => {
      expect(diagram.findView(k_person)).toBeTruthy();   
    });

    it('Should contain the non sortal: Transportation Contract Client', () => {
      expect(diagram.findView(rm_shipAdmininstrator)).toBeTruthy();
    });

    it('Should contain descendants of non sortal class: «role mixin» Transportation Contract Client', () => {
      expect(diagram.findView(r_corporteCargoClient)).toBeTruthy();
      expect(diagram.findView(r_passenger)).toBeTruthy();
    });

    it('Should contain ancestors of sortal class: «role» Corporate Cargo Client', () => {
      expect(diagram.findView(k_organization)).toBeTruthy();   
    });

    it('Should contain ancestors of sortal class: «role» Passenger', () => {
      expect(diagram.findView(k_person)).toBeTruthy();   
    });

    it('Should contain 8 shapes (classes)', () => {
      expect(diagram.getClassViews()).toHaveLength(8);
    });

    it('Should contain 8 generalizations views', () => {
      expect(diagram.getGeneralizationViews()).toHaveLength(8);
    });

    
  });
});
