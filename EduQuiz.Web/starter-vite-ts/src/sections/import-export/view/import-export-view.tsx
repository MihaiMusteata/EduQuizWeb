import type { Quiz } from "src/types/quiz";
import type { LibraryItem } from "src/types/library";
import type { FlashcardDeck } from "src/types/flashcard";
import type { Action, Format, EntityType } from "src/types/import-export";

import { useState, useEffect, useCallback } from "react";

import IconButton from "@mui/material/IconButton";
import {
  Box,
  Stack,
  Button,
  MenuItem,
  Container,
  TextField, Typography, InputAdornment
} from "@mui/material";

import { paths } from "src/routes/paths";
import { useRouter, useSearchParams } from "src/routes/hooks";

import { useAxios } from "src/axios/hooks";
import { endpoints } from "src/axios/endpoints";

import { Upload } from "src/components/upload";
import { toast } from "src/components/snackbar";
import { FullScreenDialog } from "src/components/dialog/full-screen-dialog";

import { Iconify } from "../../../components/iconify";
import { SelectActivityDialog } from "../select-activity-dialog";

export function ImportExportView() {
  const { postAuthBlob, uploadFileAuth, getAuth } = useAxios();
  const router = useRouter();

  const [action, setAction] = useState<Action>("Export");
  const [format, setFormat] = useState<Format>("PDF");
  const [entityType, setEntityType] = useState<EntityType>("Quiz");
  const [itemSelected, setItemSelected] = useState<LibraryItem | undefined>(undefined);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [listItems, setListItems] = useState<LibraryItem[]>([]);

  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const getData = async () => {
    const res = await getAuth<LibraryItem[]>(endpoints.library.get);
    if (id) {
      const selectedItem = res.find((item) => item.id === id);
      if (selectedItem) {
        setItemSelected(selectedItem);
        if (selectedItem.activity === "Flashcards") {
          setFormat("JSON");
        }
      }
    }
    setListItems(res);
  }

  const handleDropSingleFile = useCallback((acceptedFiles: File[]) => {
    const newFile = acceptedFiles[0];

    if (!newFile) return;

    const isJson = newFile.type === "application/json" || newFile.name.endsWith(".json");
    const isXml = newFile.type === "text/xml" || newFile.type === "application/xml" || newFile.name.endsWith(".xml");

    if (isJson || isXml) {
      setFile(newFile);
    } else {
      alert("Doar fișiere JSON sau XML sunt acceptate.");
    }
    setFile(newFile);
  }, []);
  const handleExport = async () => {
    try {
      if (itemSelected === undefined) {
        alert("Selectează o activitate!");
        return;
      }

      if (action === "Export" && format === "PDF") {
        router.push(paths.activity.pdfDocument(itemSelected.id ?? ''));
        return;
      }

      const requestData = {
        EntityType: itemSelected?.activity === "Quizzes" ? "Quiz" : "Flashcard",
        Format: format,
        Title: itemSelected?.title,
        Id: itemSelected?.id
      };

      const blob = await postAuthBlob(endpoints.exportImport.export, requestData);
      const fileExtension = format.toLowerCase();
      const filename = `${itemSelected?.title}.${fileExtension}`;

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Fișier descărcat cu success");
    } catch (error) {
      toast.error("Eroare la export");
      console.error("Export error:", error);
    }
  };

  const handleImport = async () => {
    if (!file) {
      alert("Selectează un fișier!");
      return
    }

    const formData = new FormData();
    formData.append("EntityType", entityType);
    formData.append("Format", format);
    formData.append("File", file);

    try {
      if (entityType === "Quiz") {
        const newEntity = await uploadFileAuth<Quiz>(endpoints.exportImport.import, formData);
        router.push(paths.activity.quiz.edit(newEntity.id ?? ''));
      } else if (entityType === "Flashcard") {
        const newEntity = await uploadFileAuth<FlashcardDeck>(endpoints.exportImport.import, formData);
        router.push(paths.activity.flashcardDeck.edit(newEntity.id ?? ''));
      }
      toast.success("Import reușit!");
    } catch (error) {
      toast.error("Eroare la import.");
    }
  };

  const renderExport = () => (
    <>
      {
        itemSelected === undefined ?
          <SelectActivityDialog
            setItemSelected={setItemSelected}
            data={
              format === "PDF"
                ? listItems.filter((item) => item.activity === "Quizzes")
                : listItems
            }
          />
          :
          <TextField
            label={itemSelected.activity}
            value={itemSelected.title}
            fullWidth
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    color="default"
                    onClick={() => {
                      setItemSelected(undefined)
                    }}
                  >
                    <Iconify icon="mdi:clear" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
      }
      <Button
        variant="contained"
        color='primary'
        onClick={handleExport}
      >
        {
          format === "PDF"
            ? 'Vizualizează PDF'
            : 'Exportă și Descarcă'
        }
        <Iconify
          width={30}
          icon='ic:twotone-cloud-download'
          sx={{
            marginLeft: 1,
          }}
        />
      </Button>
    </>
  )

  const renderImport = () => (
    <>
      <TextField
        select
        label="Tip activitate"
        value={entityType}
        onChange={(e) => setEntityType(e.target.value as EntityType)}
        fullWidth
      >
        <MenuItem value="Quiz">Quiz</MenuItem>
        <MenuItem value="Flashcard">Flashcard</MenuItem>
      </TextField>

      {
        file === undefined ?

          <Upload
            onDrop={handleDropSingleFile}
          />
          :
          <TextField
            value={file.name}
            fullWidth
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    color="default"
                    onClick={() => {
                      setFile(undefined)
                    }}
                  >
                    <Iconify icon="mdi:clear" />
                  </IconButton>
                </InputAdornment>
              ),
              startAdornment: (
                <InputAdornment position="start">
                  <>
                    {
                      file.type === "application/json" || file.name.endsWith(".json") ?
                        <Iconify width={25} icon='bi:filetype-json' />
                        :
                        <Iconify width={25} icon='bi:filetype-xml' />
                    }
                  </>
                </InputAdornment>
              ),
            }}
          />
      }
      <Button
        variant="contained"
        color='primary'
        onClick={handleImport}
      >
        Importează
        <Iconify
          width={30}
          icon='ic:twotone-cloud-upload'
          sx={{
            marginLeft: 1,
          }}
        />
      </Button>
    </>
  )

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FullScreenDialog
      onClose={() => {
        router.push(paths.dashboard.tools)
      }}
    >
      <Box
        display="flex"
        justifyContent="center"
      >
        <Container maxWidth="lg" sx={{ mt: 10 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
            Importă sau Exportă Activitatea
          </Typography>

          <Stack spacing={3}>
            <TextField
              select
              label="Acțiune"
              value={action}
              onChange={(e) => {
                setItemSelected(undefined);
                setFile(undefined);
                setAction(e.target.value as Action)
              }}
              fullWidth
            >
              <MenuItem value="Import">Import</MenuItem>
              <MenuItem value="Export">Export</MenuItem>
            </TextField>

            <TextField
              select
              label="Format"
              value={format}
              onChange={(e) => setFormat(e.target.value as Format)}
              fullWidth
            >
              {
                action === "Export" && itemSelected?.activity !== "Flashcards" &&
                <MenuItem value="PDF">PDF</MenuItem>
              }
              <MenuItem value="JSON">JSON</MenuItem>
              <MenuItem value="XML">XML</MenuItem>
            </TextField>
            {
              action === "Export" && (
                renderExport()
              )
            }
            {
              action === "Import" && (
                renderImport()
              )
            }
          </Stack>
        </Container>
      </Box>
    </FullScreenDialog>
  );
}

