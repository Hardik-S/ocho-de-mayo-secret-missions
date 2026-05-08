import type { ScreenProps } from "./screenTypes";
import ActiveMission from "./ActiveMission";
import { Button, ScreenFrame } from "./shared";

export default function RevealPhase(props: ScreenProps) {
  const { navigate } = props;

  return (
    <ScreenFrame
      title="Reveal phase"
      eyebrow="Log the outcome"
      actions={<Button onClick={() => navigate("/awards")}>Awards</Button>}
    >
      <ActiveMission {...props} />
    </ScreenFrame>
  );
}
