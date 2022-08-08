import React, { ChangeEvent } from 'react'
import { Container, Grid, InputAdornment, TextField, Typography, Box, Button, IconButton } from '@mui/material'
import PokemonCard from '../components/PokemonCard'
import { Field, usePokemonContext, PokemonType } from '../components/Contexts/PokemonProvider'
import { Search, FavoriteBorder, Favorite, Close } from '@mui/icons-material'
import PokemonTypeIcon from '../components/PokemonTypeIcon'

const Home: React.FC = () => {
  const {
    pokemon,
    pokemonTypes,
    query,
    search,
    favourites,
    addFavourite,
    removeFavourite,
    filters,
    addFilter,
    removeFilter,
    selectedPokemonTypes,
    togglePokemonTypeSelection
  } = usePokemonContext()

  function handleQueryChange(event: ChangeEvent<HTMLInputElement>) {
    search(event.target.value)
  }

  const handleToggleFavourites = () => {
    if (filters[Field.favourite]) {
      removeFilter(Field.favourite)
    } else {
      addFilter(Field.favourite, true)
    }
  }

  const handlePokemonTypeSelection = (selectedPokemonType: string) => {
    togglePokemonTypeSelection(selectedPokemonType)
  }

  const getPokemonIcon = (pokemonIconType: string) => {
    let currIcon = Object.values(PokemonType).find((pType) => PokemonType[pType] === pokemonIconType) || PokemonType.normal;
    return <PokemonTypeIcon fill='black' type={currIcon} style={{ height: '15px', width: '15px' }} />
  }

  const getPokemonTypeButton = (pokemonTypeName: string) => {
    return (<Button variant='contained'
      key={pokemonTypeName}
      color={selectedPokemonTypes.includes(pokemonTypeName) ? 'primary' : 'secondary'}
      style={{ margin: '5px' }}
      startIcon={getPokemonIcon(pokemonTypeName)}
      onClick={() => handlePokemonTypeSelection(pokemonTypeName)}
      size='small'>
      {pokemonTypeName}
    </Button>)
  }


  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Typography variant="h1">What Pokemon <br />are you looking for?</Typography>
      <Box
        sx={{
          display: 'flex',
          pt: 4,
          pb: 2
        }}
      >
        <TextField
          id="pokemon-search"
          placeholder="Search Pokemon"
          variant="outlined"
          value={query}
          onChange={handleQueryChange}
          InputProps={{
            sx: { pr: 0 },
            startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
            endAdornment: <InputAdornment position="end">
              <IconButton onClick={() => search('')}><Close /></IconButton>
            </InputAdornment>
          }}
        />

        <Button
          startIcon={filters[Field.favourite]
            ? <Favorite />
            : <FavoriteBorder />
          }
          color={filters[Field.favourite] ? 'primary' : 'secondary'}
          sx={{
            flexShrink: 0,
            ml: '2rem'
          }}
          onClick={handleToggleFavourites}
        >
          My Favourites ({favourites.length})
        </Button>
      </Box>
      <Typography variant="h5">Filter pokemons by selecting one or more pokemon types</Typography>

      <Grid container style={{ marginBottom: '2rem' }}>
        {
          pokemonTypes?.map((pokemonType) => getPokemonTypeButton(pokemonType.name))
        }
      </Grid>

      <Grid container spacing={2}>
        {pokemon.map((pokemon) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={pokemon.name}
          >
            <PokemonCard
              pokemon={pokemon}
              isFavourite={favourites.includes(pokemon.name)}
              onAddFavourite={() => addFavourite(pokemon)}
              onRemoveFavourite={() => removeFavourite(pokemon)}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default Home