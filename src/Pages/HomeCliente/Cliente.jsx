import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
import { supabase } from "../../config/supabaseClient";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Swal from "sweetalert2";
import i18n from "../../config/localization/i18n";

export default function BasicTable() {
  const [datos, setData] = useState([]);
  const [precio, setPrecio] = useState([]);
  const [tiempo, setTiempo ] = useState();
  const [horaInicial, setHoraInicial] = useState();
  const [horaFinal, setHoraFinal] = useState();
  const [año,setAño] = useState();

  useEffect(() => {
    read();
  });

  useEffect(() => {
  },[horaInicial]);

  useEffect(() => {
  },[horaFinal]);

  //READ CRUD
  const read = async () => {
    let {data: registros} = await supabase.from("registros").select("*");
    let {data: precio} = await supabase.from("precio").select("valor");
    setData(registros);
    setPrecio(precio[0].valor);
    var today = new Date();
    setAño(today.getFullYear() + '/' + today.getMonth() + '/'+today.getDate());
  };

  //INSERT
  const checkOut = async (id, entrada, salida) => {
    var today = new Date();
    setHoraFinal(today.getHours()+(today.getMinutes()/60));
    setTiempo(horaFinal-horaInicial);
    let {data: dato} = await supabase
      .from("registros")
      .update({ salida: today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()})
      .eq("id", id);
    salida= dato[0].salida;
    showAlert(id, entrada, salida);
  };

  //CREATE

  const checkIn = async () => {
    var today = new Date();
    setHoraInicial(today.getHours()+(today.getMinutes()/60));
    var inf = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    await supabase
      .from("registros")
      .insert({ entrada: today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()});
      await supabase
      .from("historico")
      .insert({ entrada: inf, salida: inf});
  };

  //DELETE

  const deleteScore = async (id) => {
    try {
      await supabase.from("registros").delete().eq("id", id);
    } catch (error) {
      console.log("error", error);
    }
  };

  //ShowAlert

  const showAlert = (id, entrada, salida) => {
    Swal.fire({
      title: "Pago",
      html:
        "Id: " +
        id +
        "<br/>" +
        "Entrada: " +
        entrada +
        "<br/>" +
        "Salida: " +
        salida,
      icon: "success",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Pagar?",
    }).then((result) => {
      if (result.isConfirmed) {
          var tiempoT = tiempo;
        Swal.fire(
          "Pago",
          "tiempo: " + (tiempoT < 1 ?  tiempoT=1 : tiempoT)+
            "<br/>" +
            "precio: " +
            precio +
            "<br/>" +
            "Total: " +
            '$'+tiempoT * precio + '.00',
          "success"
        );
        deleteScore(id);
      }
    });
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 1000 }}>
      <Typography variant="h1" component="div" gutterBottom align="center">
        {i18n.t("Estacionamiento")}
      </Typography>
      <Typography variant="h3" component="div" gutterBottom align="center">
        {año}
      </Typography>
      <Typography variant="h4" component="div" gutterBottom align="center">
        {i18n.t("H/F")+precio+".00"}
      </Typography>
      <Button variant="outlined" onClick={checkIn} color={"success"}>
        {i18n.t("Entrada")}
      </Button>
      <Button variant="outlined" onClick={() => supabase.auth.signOut()}>
      {i18n.t("Deslogearse")}
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>{i18n.t("Entrada")}</TableCell>
              <TableCell>{i18n.t("Salida")}</TableCell>
              <TableCell>{i18n.t("Acciones")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datos.map((row) => (
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.entrada}</TableCell>
                <TableCell>{row.salida}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={() => checkOut(row.id, row.entrada, row.salida)}
                    href="#"
                  >
                    {i18n.t("Salida")}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
