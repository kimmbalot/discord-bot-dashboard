import {
  Button,
  Text,
  useColorModeValue,
  Alert,
  AlertIcon,
  ButtonGroup,
  Slide,
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { useState } from "react";
import { updateFeatureOptions } from "api/yeecord";

export function SaveAlert({
  saving,
  setSaving,
  changes,
  onSave: afterSave,
  onDiscard: afterDiscard,
}) {
  const [error, setError] = useState(null);
  let alertBg = useColorModeValue(
    "rgba(244, 247, 254, 0.7)",
    "rgba(11,20,55,0.7)"
  );
  let modalBg = useColorModeValue("rgba(244, 247, 254)", "rgba(11,20,55)");

  let mainText = useColorModeValue("navy.700", "white");
  let brand = useColorModeValue("green.300", "green.500");

  const onSave = () => {
    const target = new Map(changes);
    setSaving(true);

    updateFeatureOptions(target)
      .then(() => {
        afterSave(target);
      })
      .catch((e) => {
        setError(e.message);
      })
      .finally(() => {
        setSaving(false);
      });
  };

  const onDiscard = () => {
    setSaving(false);
    afterDiscard();
  };

  return (
    <>
      <Modal isCentered isOpen={error != null} onClose={() => setError(null)}>
        <ModalContent bg={modalBg} rounded="2xl">
          <ModalHeader>未能保存更改</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>{error}</Text>
          </ModalBody>

          <ModalFooter>
            <Button onClick={() => setError(null)}>關閉</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Slide direction="bottom" in={changes.size !== 0} style={{ zIndex: 10 }}>
        <Alert
          w={{
            base: "calc(100vw - 6%)",
            md: "calc(100vw - 8%)",
            lg: "calc(100vw - 6%)",
            xl: "calc(100vw - 350px)",
            "2xl": "calc(100vw - 365px)",
          }}
          mx="auto"
          rounded="2xl"
          status="warning"
          backdropFilter="blur(10px)"
          bg={alertBg}
          textColor={mainText}
          mb="10"
        >
          <AlertIcon />
          您有一些未保存的更改
          <ButtonGroup ml="auto">
            <Button bg={brand} isLoading={saving} onClick={onSave}>
              立即保存
            </Button>
            <Button onClick={onDiscard}>放棄更改</Button>
          </ButtonGroup>
        </Alert>
      </Slide>
    </>
  );
}
