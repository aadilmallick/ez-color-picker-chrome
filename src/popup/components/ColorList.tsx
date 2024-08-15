import React, { useEffect } from "react";
import { Handler, storage } from "../../background/handlers";
import { DropDownModal, DropdownModalProps } from "../../components/Modal";
import { useStore } from "../hooks/useStore";

const ColorList = () => {
  const { colors, setColors } = useStore();
  useEffect(() => {
    async function getColors() {
      const storedColors = await storage.get("savedColors");
      setColors(storedColors);
    }

    getColors();
  }, []);
  return (
    <div
      className="grid px-1 pt-2 grid-cols-2 gap-4 mt-4 pb-4 overflow-y-auto fancy-scroll max-h-64 overflow-x-visible"
      style={{
        gridAutoRows: "2rem",
      }}
    >
      {colors.map((data) => (
        <ColorItem data={data} key={data.color} />
      ))}
    </div>
  );
};

const ColorItem = ({ data }: { data: { url: string; color: string } }) => {
  const { colors, setColors } = useStore();
  const [text, setText] = React.useState(data.color);
  const style = {
    backgroundColor: data.color,
  };
  const actions: DropdownModalProps["actions"] = [
    {
      text: "copy",
      onClick: async () => {
        await navigator.clipboard.writeText(data.color);
        setText("Copied!");
        setTimeout(() => {
          setText(data.color);
        }, 2000);
      },
      color: `${data.color}80`,
    },
    {
      text: "delete",
      onClick: async () => {
        await Handler.deleteColor(data.color);
        setColors(colors.filter((c) => c.color !== data.color));
      },
      textColor: "red",
    },
    {
      text: "go to website",
      onClick: async () => {
        await chrome.tabs.create({ url: data.url });
      },
      textColor: "steelblue",
    },
  ];
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <div
      className="w-full border border-gray-300 shadow-sm flex items-center justify-center cursor-pointer"
      style={style}
      onClick={(e) => {
        setIsModalOpen(true);
      }}
    >
      <div className=" text-black font-semibold p-1 text-xs glassmorphism rounded-full">
        {text}
      </div>
      <DropDownModal
        actions={actions}
        isOpen={isModalOpen}
        hideModal={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ColorList;
