import { Alert } from "antd";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, DispatchType } from "../../redux/store";
import { hideAlert } from "../../redux/reducers/AlertReducer";
import { motion, AnimatePresence } from "framer-motion";

const AlertGlobal = () => {
  const dispatch: DispatchType = useDispatch();
  const { type, message, description, visible } = useSelector(
    (state: RootState) => state.AlertReducer
  );

  if (!visible || !type) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 pb-170"
        >
          <Alert
            message={<span className="text-xl font-semibold">{message}</span>}
            description={<span className="text-lg">{description}</span>}
            type={type}
            showIcon
            closable
            onClose={() => dispatch(hideAlert())}
            className="max-w-md w-[90%]"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AlertGlobal;
