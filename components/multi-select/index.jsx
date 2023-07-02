import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { Avatar } from '@mui/material';

/* optionsSample
[
  {
    id: 1,
    label: "Nguyễn Văn A",
    image: img
  },
  {
    id: 2,
    label: "Nguyễn Văn B",
    image: img
  },
]
*/


export default function MultiSelect({options, selectedIds, setSelectedIds, labelText}) {
  const handleChange = (event) => {
    const {
      target: { value },
    } = event

    setSelectedIds(value === 'string' ? value.split(',') : value,)
  }

  return (
    <div>
      <FormControl className="w-full">
        <InputLabel id="demo-multiple-chip-label">{labelText}</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={selectedIds}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label={labelText} />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((objectId) => {
                const objectData = options?.find(v => v.id == objectId)
                return (
                <Chip
                  key={objectId}
                  avatar={<Avatar alt="avt" src={objectData.image} />}
                  label={objectData.label}
                  variant='outlined'
                />
              )})}
            </Box>
          )}
        >
          {options.map((name) => (
            <MenuItem
              key={name.id}
              value={name.id.toString()}
            >
              <div className='flex items-center'>
                <Avatar alt="avt" src={name.image} sx={{ width: 30, height: 30 }} />
                <div className="ml-16 font-semibold text-lg">{name.label}</div>
              </div>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}