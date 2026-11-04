// Each site photo is paired with the photo it replaced (public/images/alt), so RotatingImage can fade between them.
// Pairs are keyed by the imported image object, so any component can ask for the variants of an image it already has.
import type { StaticImageData } from "next/image";

import blueprint from "@/public/images/blueprint.jpg";
import blueprintAlt from "@/public/images/alt/blueprint.jpg";
import circuitBoard from "@/public/images/circuit-board.jpg";
import circuitBoardAlt from "@/public/images/alt/circuit-board.jpg";
import clientMeeting from "@/public/images/client-meeting.jpg";
import clientMeetingAlt from "@/public/images/alt/client-meeting.jpg";
import cloudComputing from "@/public/images/cloud-computing.jpg";
import cloudComputingAlt from "@/public/images/alt/cloud-computing.jpg";
import codeScreen from "@/public/images/code-screen.jpg";
import codeScreenAlt from "@/public/images/alt/code-screen.jpg";
import company from "@/public/images/company.jpg";
import companyAlt from "@/public/images/alt/company.jpg";
import cyberCircuit from "@/public/images/cyber-circuit.jpg";
import cyberCircuitAlt from "@/public/images/alt/cyber-circuit.jpg";
import dataCenter from "@/public/images/data-center.jpg";
import dataCenterAlt from "@/public/images/alt/data-center.jpg";
import developerDesk from "@/public/images/developer-desk.jpg";
import developerDeskAlt from "@/public/images/alt/developer-desk.jpg";
import globalNetwork from "@/public/images/global-network.jpg";
import globalNetworkAlt from "@/public/images/alt/global-network.jpg";
import hardwareLineup from "@/public/images/hardware-lineup.jpg";
import hardwareLineupAlt from "@/public/images/alt/hardware-lineup.jpg";
import helpdesk from "@/public/images/helpdesk.jpg";
import helpdeskAlt from "@/public/images/alt/helpdesk.jpg";
import heroHome from "@/public/images/hero-home.jpg";
import heroHomeAlt from "@/public/images/alt/hero-home.jpg";
import hiringSuccess from "@/public/images/hiring-success.jpg";
import hiringSuccessAlt from "@/public/images/alt/hiring-success.jpg";
import itEngineer from "@/public/images/it-engineer.jpg";
import itEngineerAlt from "@/public/images/alt/it-engineer.jpg";
import itHardware from "@/public/images/it-hardware.jpg";
import itHardwareAlt from "@/public/images/alt/it-hardware.jpg";
import itSupport from "@/public/images/it-support.jpg";
import itSupportAlt from "@/public/images/alt/it-support.jpg";
import laptopGlow from "@/public/images/laptop-glow.jpg";
import laptopGlowAlt from "@/public/images/alt/laptop-glow.jpg";
import managedItServices from "@/public/images/managed-it-services.jpg";
import managedItServicesAlt from "@/public/images/alt/managed-it-services.jpg";
import mission from "@/public/images/mission.jpg";
import missionAlt from "@/public/images/alt/mission.jpg";
import officeInterior from "@/public/images/office-interior.jpg";
import officeInteriorAlt from "@/public/images/alt/office-interior.jpg";
import patchPanel from "@/public/images/patch-panel.jpg";
import patchPanelAlt from "@/public/images/alt/patch-panel.jpg";
import recruitment from "@/public/images/recruitment.jpg";
import recruitmentAlt from "@/public/images/alt/recruitment.jpg";
import serverRacks from "@/public/images/server-racks.jpg";
import serverRacksAlt from "@/public/images/alt/server-racks.jpg";
import skyline from "@/public/images/skyline.jpg";
import skylineAlt from "@/public/images/alt/skyline.jpg";
import softwareDashboard from "@/public/images/software-dashboard.jpg";
import softwareDashboardAlt from "@/public/images/alt/software-dashboard.jpg";
import teamCollaboration from "@/public/images/team-collaboration.jpg";
import teamCollaborationAlt from "@/public/images/alt/team-collaboration.jpg";
import teamCollaborationWide from "@/public/images/team-collaboration-wide.jpg";
import teamCollaborationWideAlt from "@/public/images/alt/team-collaboration-wide.jpg";
import teamPresentation from "@/public/images/team-presentation.jpg";
import teamPresentationAlt from "@/public/images/alt/team-presentation.jpg";
import teamWorkshop from "@/public/images/team-workshop.jpg";
import teamWorkshopAlt from "@/public/images/alt/team-workshop.jpg";
import vision from "@/public/images/vision.jpg";
import visionAlt from "@/public/images/alt/vision.jpg";
import workstation from "@/public/images/workstation.jpg";
import workstationAlt from "@/public/images/alt/workstation.jpg";

const pairs: [StaticImageData, StaticImageData][] = [
  [blueprint, blueprintAlt],
  [circuitBoard, circuitBoardAlt],
  [clientMeeting, clientMeetingAlt],
  [cloudComputing, cloudComputingAlt],
  [codeScreen, codeScreenAlt],
  [company, companyAlt],
  [cyberCircuit, cyberCircuitAlt],
  [dataCenter, dataCenterAlt],
  [developerDesk, developerDeskAlt],
  [globalNetwork, globalNetworkAlt],
  [hardwareLineup, hardwareLineupAlt],
  [helpdesk, helpdeskAlt],
  [heroHome, heroHomeAlt],
  [hiringSuccess, hiringSuccessAlt],
  [itEngineer, itEngineerAlt],
  [itHardware, itHardwareAlt],
  [itSupport, itSupportAlt],
  [laptopGlow, laptopGlowAlt],
  [managedItServices, managedItServicesAlt],
  [mission, missionAlt],
  [officeInterior, officeInteriorAlt],
  [patchPanel, patchPanelAlt],
  [recruitment, recruitmentAlt],
  [serverRacks, serverRacksAlt],
  [skyline, skylineAlt],
  [softwareDashboard, softwareDashboardAlt],
  [teamCollaboration, teamCollaborationAlt],
  [teamCollaborationWide, teamCollaborationWideAlt],
  [teamPresentation, teamPresentationAlt],
  [teamWorkshop, teamWorkshopAlt],
  [vision, visionAlt],
  [workstation, workstationAlt],
];

const variants = new Map(pairs);

/** The image followed by the photo it is paired with, ready for RotatingImage. */
export function withVariants(image: StaticImageData): StaticImageData[] {
  const other = variants.get(image);
  return other ? [image, other] : [image];
}
