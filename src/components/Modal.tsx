export interface DropdownModalProps {
  isOpen: boolean;
  hideModal: () => void;
  actions: {
    text: string;
    onClick: () => void;
    color?: string;
    textColor?: string;
  }[];
}
export const DropDownModal = ({
  hideModal,
  isOpen,
  actions,
}: DropdownModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        e.stopPropagation();
        hideModal();
      }}
    >
      <div className="modal modal-dropdown rounded overflow-hidden bg-white/75">
        {actions.map((action) => (
          <button
            className="w-full border-b-2 border-gray-300 font-semibold p-1 text-center hover:opacity-75 transition-opacity"
            style={{
              backgroundColor: action.color || "white",
              color: action.textColor || "black",
            }}
            key={action.text}
            onClick={(e) => {
              e.stopPropagation();
              action.onClick();
              hideModal();
            }}
          >
            {action.text}
          </button>
        ))}
      </div>
    </div>
  );
};
