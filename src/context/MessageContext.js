import React, { useContext, createContext, useState } from "react";
import { Window } from "components/Window/Window";
import { Button } from "@material-ui/core";
import styles from "./MessageContent.module.css";

const defaultState = {};

const MessageContext = createContext(defaultState);

export const useMessageContext = () => useContext(MessageContext);

export const withMessageContext = (component) => (props) => {
  return (() => {
    const value = useMessageContext();
    return React.createElement(component, { ...props, MessageContext: value });
  })();
};

const MessageContextProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [_title, setTitle] = useState(false);
  const [_components, setComponents] = useState(false);
  const [_buttons, setButtons] = useState([{ text: "Ок", handler: () => {} }]);

  const ShowWindow = ({ title, components }) => {
    setComponents(components);
    setTitle(title);
    setOpen(true);
    setButtons([{ text: "Ок", handler: () => {} }]);
  };

  const ShowAcceptWindow = ({ title, components, buttons }) => {
    setComponents(components);
    setTitle(title);
    buttons && setButtons(buttons);
    setOpen(true);
  };

  return (
    <MessageContext.Provider
      value={{
        ShowWindow,
        ShowAcceptWindow,
      }}
    >
      <Window className={styles.window} open={open} setOpen={setOpen} title={_title}>
        <div className={styles.content}>{_components}</div>
        <div className={styles.bbar}></div>
        {_buttons.map((button) => (
          <Button
            style={{margin: '0 10px 0 0'}}
            color={button.color || "primary"}
            variant="contained"
            onClick={() => {
              setOpen(false);
              button.handler && button.handler();
            }}
          >
            {button.text}
          </Button>
        ))}
      </Window>
      {children}
    </MessageContext.Provider>
  );
};

export default MessageContextProvider;
