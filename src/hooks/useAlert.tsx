import { useAlertContext } from "../components/shared/ui/Alert";

const useAlert = () => {
  const { confirm } = useAlertContext();
  return { confirm };
};

export default useAlert;
