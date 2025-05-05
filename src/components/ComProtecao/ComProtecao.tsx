import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { sessaoOperador } from "@/utils/auth/storageService";
import Modal from "@/components/ModalPadrao/ModalPadrao";

export default function ComProtecao({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const matricula = sessaoOperador.getMatriculaOperador();
    if (!matricula) {
      setShowModal(true);
    }
  }, []);

  useEffect(() => {
    if (!showModal && redirect) {
      router.push("/coletor/login");
    }
  }, [showModal, redirect, router]);

  const handleModalClose = () => {
    setShowModal(false);
    setRedirect(true);
  };

  return (
    <>
      {showModal && (
        <Modal
          message="Efetue o login antes de utilizar o sistema."
          onClose={handleModalClose}
        />
      )}
      {!showModal && children}
    </>
  );
}
