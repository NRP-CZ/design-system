// This file is part of InvenioRDM
// Copyright (C) 2023 CERN.
// Copyright (C) 2023 Northwestern University.
//
// Invenio App RDM is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { useState } from "react";
import PropTypes from "prop-types";
import { Grid, Dropdown, Button } from "semantic-ui-react";
import { i18next } from "@translations/oarepo_ui/i18next";

export function ExportDropdown({
  recordExportInfo: { formatOptions, exportBaseUrl },
}) {
  const [selectedExportFormat, setSelectedExportFormat] = useState(
    formatOptions[0].value
  );
  return (
    <Grid>
      <Grid.Column width={10}>
        <Dropdown
          aria-label={i18next.t("Export selection")}
          defaultValue={selectedExportFormat}
          fluid
          onChange={(event, data) => { setSelectedExportFormat(data.value); }}
          options={formatOptions}
          selectOnNavigation={false}
          selection
        />
      </Grid.Column>
      <Grid.Column className="pl-0" width={6}>
        <Button
          as="a"
          className="pl-5 pr-5"
          fluid
          href={`${exportBaseUrl}/${selectedExportFormat}`}
          title={i18next.t("Download file")}
          type="button"
        >
          {i18next.t("Export")}
        </Button>
      </Grid.Column>
    </Grid>
  );
}

ExportDropdown.propTypes = {
  recordExportInfo: PropTypes.shape({
    formatOptions: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      })
    ).isRequired,
    exportBaseUrl: PropTypes.string.isRequired,
  }).isRequired,
};
