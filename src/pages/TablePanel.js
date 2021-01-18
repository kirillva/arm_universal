import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Table } from "components/table/Table";
import { BoolFilter, DateFilter, NumberFilter, SelectFilter, StringFilter } from "components/table/Filters";
import { BoolCell, DateCell, NumberCell, StringCell } from "components/table/Cell";

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(3),
  },
  table: {
    flex: 1,
  },
}));

export const TablePanel = () => {
  const classes = useStyles();
  
  const cs_street = React.useMemo(
    () => [
      { title: 'c_short_type', accessor: 'c_short_type', Filter: SelectFilter, Cell: StringCell },
      { title: 'c_name', accessor: 'c_name', Filter: SelectFilter, Cell: StringCell },
      { title: 'dx_date', accessor: 'dx_date', Filter: DateFilter, Cell: DateCell },
      { title: 'b_disabled', accessor: 'b_disabled', Filter: BoolFilter, Cell: BoolCell },
      { title: 'f_division', accessor: 'f_division', Filter: SelectFilter, Cell: StringCell },
      { title: 'f_user', accessor: 'f_user', Filter: SelectFilter, Cell: StringCell },    
    ],
    []
  );

  const cs_house = React.useMemo(
    () => [
      { title: 'f_street', accessor: 'f_street', Filter: SelectFilter, Cell: StringCell }, 
      { title: 'c_house_num', accessor: 'c_house_num', Filter: StringFilter, Cell: StringCell }, 
      { title: 'c_build_num', accessor: 'c_build_num', Filter: StringFilter, Cell: StringCell }, 
      { title: 'dx_date', accessor: 'dx_date', Filter: DateFilter, Cell: DateCell },
      { title: 'b_disabled', accessor: 'b_disabled', Filter: BoolFilter, Cell: BoolCell }, 
      { title: 'n_uik', accessor: 'n_uik', Filter: NumberFilter, Cell: NumberCell }, 
      { title: 'c_floor', accessor: 'c_floor', Filter: SelectFilter, Cell: StringCell }, 
      { title: 'c_porch', accessor: 'c_porch', Filter: SelectFilter, Cell: StringCell }, 
      { title: 'f_subdivision', accessor: 'f_subdivision', Filter: SelectFilter, Cell: StringCell }, 
      { title: 'f_user', accessor: 'f_user', Filter: SelectFilter, Cell: StringCell }, 
      { title: 'f_candidate_users', accessor: 'f_candidate_users', Filter: SelectFilter, Cell: StringCell }, 
      { title: 'b_correct_uik', accessor: 'b_correct_uik', Filter: BoolFilter, Cell: BoolCell }, 
      { title: 'n_uik_correct', accessor: 'n_uik_correct', Filter: NumberFilter, Cell: NumberCell }
    ],
    []
  );

  const cs_appartament = React.useMemo(
    () => [
      { title: 'f_house', accessor: 'f_house', Filter: SelectFilter, Cell: StringCell }, 
      { title: 'c_number', accessor: 'c_number', Filter: StringFilter, Cell: StringCell }, 
      { title: 'n_number', accessor: 'n_number', Filter: StringFilter, Cell: StringCell }, 
      { title: 'dx_date', accessor: 'dx_date', Filter: DateFilter, Cell: DateCell }, 
      { title: 'b_disabled', accessor: 'b_disabled', Filter: BoolFilter, Cell: BoolCell }, 
      { title: 'f_user', accessor: 'f_user', Filter: SelectFilter, Cell: StringCell }, 
      { title: 'n_signature_2018', accessor: 'n_signature_2018', Filter: NumberFilter, Cell: NumberCell }, 
      { title: 'f_main_user', accessor: 'f_main_user', Filter: SelectFilter, Cell: StringCell }
    ],
    []
  );

  return (
    <div className={classes.content}>
      <div className={classes.toolbar} />
      <div className={classes.table}>
        <Table columns={cs_street} action="cs_street" />
      </div>
      <div className={classes.table}>
        <Table columns={cs_house} action="cs_house" />
      </div>
      <div className={classes.table}>
        <Table columns={cs_appartament} action="cs_appartament" />
      </div>
    </div>
  );
};
