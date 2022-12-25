export const styles = (theme) => ({
  table: {
    borderCollapse: "separate",
    borderSpacing: "0 3px",
    marginBottom: 70,

    "& td > p:first-child": {
      fontWeight: "bold",
      maxWidth: 340,
    },

    "& td": {
      color: theme.palette.black.dark,
    },
  },
  tableBodyRow: {
    boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.05)",
  },
});
