import { Button, TextField } from "@material-ui/core";
import { PrintSharp } from "@material-ui/icons";
import React from "react";
import Chuvash from "assets/chuvash.png";
import ReactDOMServer from "react-dom/server";
import moment from "moment";

export const DocumentPrint = ({ id, c_number, dx_date }) => {
  function onPrintItems(text) {
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
  }

  const content = (
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
            ЧĂВАШ РЕСПУБЛИКИ ШУПАШКАР ХУЛА АДМИНИСТРАЦИЙĚН ПУРĂНМАЛЛИ ÇУРТ-ЙĚРПЕ
            КОМУНАЛЛĂ ХУÇАЛАХ, ЭНЕРГЕТИКА, ТРАНСПОРТ ТАТА ÇЫХĂНУ УПРАВЛЕНИЙĚ
          </b>
          <b>
            Чувашская Республика УПРАВЛЕНИЕ ЖКХ, ЭНЕРГЕТИКИ, ТРАНСПОРТА И СВЯЗИ
            администрации города Чебоксары
          </b>
          <p style={{ fontSize: "0.8em" }}>
            428000, г. Чебоксары, ул. К. Маркса, 36 тел.(8352) 62-10-49; факс
            (8352) 23-50-11; E-mail: gcheb05@cap.ru
          </p>
          <p style={{ textDecoration: "underline" }}>
            {moment(dx_date).format("DD.MM.YYYY")} №{c_number}
          </p>
        </div>
        <div style={{ flex: 1 }}>
          Гр. Кадеева Анна Юрьевна, г. Чебоксары,улица 8-я Южная, д. 46
        </div>
      </div>
      <div style={{ textIndent: "50px" }}>
        <p>
          Управление ЖКХ, энергетики, транспорта и связи администрации города
          Чебоксары сообщает, что Ваша просьба о постановке на учет для
          получения земельного участка в собственность бесплатно удовлетворена.
        </p>
        <p>
          Постановлением администрации города Чебоксары от 13.04.2021 № 656 Ваша
          семья включена в Реестр учета многодетных семей, имеющих право на
          бесплатное предоставление в собственность земельных участков, с
          09.04.2021 под № 9914.
        </p>
        <p>
          По вопросу распределения и предоставления земельных участков Вы можете
          обращаться в МБУ «Управление территориального планирования»
          администрации города Чебоксары, тел.23-12-28.
        </p>
      </div>
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div>
            <TextField
              value={
                "Заместитель начальника управления ЖКХ, энергетики, транспорта и связи"
              }
            />
          </div>
          <div>
            <TextField value={"Д.С. Денисов"} />
          </div>
        </div>
        <p style={{ fontSize: "0.8em" }}>Купцова Т.Г. 23-50-64</p>
      </div>
    </>
  );

  return (
    <>
      {content}
      <Button
        startIcon={<PrintSharp />}
        onClick={() => onPrintItems(ReactDOMServer.renderToString(content))}
      >
        Распечатать
      </Button>
    </>
  );
};
