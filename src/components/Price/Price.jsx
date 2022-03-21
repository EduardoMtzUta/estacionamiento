import Box from "@mui/material/Box";
import React, { useState} from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { supabase } from "../../config/supabaseClient";
import Account from "../Account/Account";
import i18n from "../../config/localization/i18n";


export default function PriceValue({ session }) {
  const [valorP, setValorP] = useState(15);

  //CREATE CRUD
  const addPrice = async () => {
    await supabase
      .from("precio")
      .update({ valor: valorP })
      .eq("id", 1);
  };

  const profile = () => {
    return <div><Account /></div>;
  }

  return (
    <Box>
      <Grid container marginBottom={5} marginTop={5}>
        <Grid>
          <input
            type="number"
            onChange={(e) => setValorP(parseInt(e.target.valueAsNumber))}
            placeholder={valorP}
          />
        </Grid>
        <Grid marginLeft={5}>
          <Button variant="contained" onClick={() => addPrice()}>
            {i18n.t("precio")}
          </Button>
        </Grid>
        <Grid marginLeft={5}>
          <Button variant="contained" onClick={() => profile()} >
            {i18n.t("Perfil")}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
