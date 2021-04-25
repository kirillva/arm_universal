import { Button, TextField } from "@material-ui/core";
import { PrintSharp } from "@material-ui/icons";
import React from "react";
import Chuvash from "assets/chuvash.png";
import ReactDOMServer from "react-dom/server";
import moment from "moment";
import { runRpc } from "utils/rpc";

export const DocumentPrint = ({ values, state, setState }) => {
  const { n_number, d_date, c_fio, c_address, c_accept, c_account } = values;

  function onPrintItems(text) {
    runRpc({
      action: "dd_documents",
      method: "Update",
      data: [{id: values.id, jb_print: state }],
      type: "rpc",
    }).finally(() => {
      var blob = new Blob([text], {
        type: "text/html",
      });
      var blob_url = URL.createObjectURL(blob);
      var iframe = document.createElement("iframe");
      iframe.src = blob_url;
      iframe.style = "display:none;";
      document.body.appendChild(iframe);
      iframe.contentWindow.print();
      URL.revokeObjectURL(blob_url);
    });

  }

  const getContent = (print) => {
    return (
      <>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              textAlign: "center",
            }}
          >
            <div>
              <img src={Chuvash} alt="chuvash" height="100px" />
            </div>
            <b>
              ЧĂВАШ РЕСПУБЛИКИ<br/> ШУПАШКАР ХУЛА АДМИНИСТРАЦИЙĚН<br/> ПУРĂНМАЛЛИ
              ÇУРТ-ЙĚРПЕ КОМУНАЛЛĂ<br/>  ХУÇАЛАХ, ЭНЕРГЕТИКА, ТРАНСПОРТ ТАТА<br/>  ÇЫХĂНУ
              УПРАВЛЕНИЙĚ
            </b>
            <div style={{ textDecoration: 'underline', width: '100px', height: '20px', borderBottom: '1px solid', margin: 'auto' }}> </div>
            <b>
              Чувашская Республика<br/>  УПРАВЛЕНИЕ ЖКХ, ЭНЕРГЕТИКИ,<br/>  ТРАНСПОРТА И
              СВЯЗИ<br/>  администрации города<br/>  Чебоксары
            </b>
            <p style={{ fontSize: "0.8em" }}>
              428000, г. Чебоксары, ул. К. Маркса, 36<br/>  тел.(8352) 62-10-49; факс
              (8352) 23-50-11;<br/>  E-mail: gcheb05@cap.ru
            </p>
            <div style={{ textDecoration: "underline" }}>
              {moment(d_date).format("DD.MM.YYYY")} №{n_number}
            </div>
            <div style={{ textDecoration: 'underline', width: '200px', height: '20px', borderBottom: '1px solid', margin: 'auto' }}> </div>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column',  justifyContent: 'center'}}>
            <div>Гр. {c_fio},</div>
            <div>{c_address}</div>
          </div>
        </div>
        <div style={{ textIndent: "50px" }}>
          <p>
            Управление ЖКХ, энергетики, транспорта и связи администрации города
            Чебоксары сообщает, что Ваша просьба о постановке на учет для
            получения земельного участка в собственность бесплатно
            удовлетворена.
          </p>
          <p style={{ lineHeight: "33px" }}>
            Постановлением администрации города Чебоксары от {" "}
            {!print  ? <TextField
              style={{ margin: "0 10px" }}
              value={state.registry} onChange={(e)=>setState({...state, registry: e.target.value})}
            /> : state.registry}{" "}
            {/* {c_accept || '"нет данных"'} {" "} */}
            Ваша семья включена в Реестр учета многодетных семей, имеющих право
            на бесплатное предоставление в собственность земельных участков,{" "}
            {/* {c_account || '"нет данных"'} */}
             {!print  ? <TextField
              style={{ margin: "0 10px" }}
              value={state.land} onChange={(e)=>setState({...state, land: e.target.value})}
            /> : state.land}
          </p>
          <p>
            По вопросу распределения и предоставления земельных участков Вы
            можете обращаться в МБУ «Управление территориального планирования»
            администрации города Чебоксары, тел.23-12-28.
          </p>
        </div>
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              gap: "15px",
            }}
          >
             {!print ? <TextField
              style={{ flex: 1 }}
              value={state.position} onChange={(e)=>setState({...state, position: e.target.value})}
            /> : <div style={{ flex: 1 }}>{state.position}</div>}
             {!print ? <TextField value={state.official_name} onChange={(e)=>setState({...state, official_name: e.target.value})} /> : <div>{state.official_name}</div>}
          </div>
          <p style={{ fontSize: "0.8em" }}>Купцова Т.Г. 23-50-64</p>
        </div>
      </>
    );
  };

  return (
    <>
      {getContent()}
      <Button
        disabled={!c_accept || !c_account}
        startIcon={<PrintSharp />}
        onClick={() =>
          onPrintItems(ReactDOMServer.renderToString(getContent(true)))
        }
      >
        Распечатать
      </Button>
    </>
  );
};
