import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setActiveChannel } from "../../store/slices/chatSlice";
import { Plus } from "lucide-react";
import styles from "../ChannelList/ChannelList.module.scss";
import cn from "classnames";

const ChanelList = () => {
  const dispatch = useDispatch;
  return (
    <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <b>Каналы</b>
        <button
          type="button"
          className={cn(styles["btn-custom"], "p-0 btn btn-group-vertical")}
        >
          <Plus size={18} />
        </button>
      </div>
      <ul></ul>
    </div>
  );
};

export default ChanelList;
