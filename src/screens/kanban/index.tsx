import React from "react";
import { useDocumentTitle } from "../../utils";
import { useKanbans } from "../../utils/kanban";
import { useKanbanSearchParams, useProjectInUrl } from "./util";
import { KanbanColumn } from "./KanbanColumn";
import styled from "@emotion/styled";
import { SearchPanel } from "./SearchPanel";

export const Kanban = () => {
  useDocumentTitle("看板列表");

  const { data: currentProject } = useProjectInUrl();
  const { data: kanbans } = useKanbans(useKanbanSearchParams());
  return (
    <div>
      <h1>{currentProject?.name}看板</h1>
      <SearchPanel />
      <ColumnContainer>
        {kanbans?.map((kanban) => {
          return <KanbanColumn kanban={kanban} key={kanban.id} />;
        })}
      </ColumnContainer>
    </div>
  );
};

const ColumnContainer = styled.div`
  display: flex;
  overflow: hidden;
  margin-right: 2rem;
`;
