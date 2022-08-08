import React, { useContext, useEffect, useState } from 'react'
import PokeAPI, { INamedApiResource, IPokemon, IPokemonType } from 'pokeapi-typescript'
import { getIdFromUrl, isOG } from '../../utils'

export enum Field {
  favourite = 'favourite',
}

type Filters = { [key in Field]: FilterValue }
type FilterValue = boolean | string | string[] | undefined

interface PokemonFilterName {
    name : string;
    url : string;
}

interface PokemonContextData {
  pokemon: INamedApiResource<IPokemon>[]
  pokemonTypes: INamedApiResource<IPokemonType>[] | undefined
  query: string
  search: (query: string) => void
  favourites: string[]
  addFavourite: (pokemon: INamedApiResource<IPokemon>) => void
  removeFavourite: (pokemon: INamedApiResource<IPokemon>) => void
  filters: Filters
  addFilter: (field: Field, value: FilterValue) => void
  removeFilter: (field: Field) => void
  selectedPokemonTypes: string[]
  togglePokemonTypeSelection: (pokemonType: string) => void
}

export const PokemonContext = React.createContext<PokemonContextData | undefined>(undefined)

interface PokemonProviderProps {
  children: React.ReactNode
}

export enum PokemonType {
  bug = "bug",
  dark = "dark",
  dragon = "dragon",
  electric = "electric",
  fairy = "fairy",
  fighting = "fighting",
  fire = "fire",
  flying = "flying",
  ghost = "ghost",
  grass = "grass",
  ground = "ground",
  ice = "ice",
  normal = "normal",
  poison = "poison",
  psychic = "psychic",
  rock = "rock",
  steel = "steel",
  water = "water",
}

export enum PokemonStat {
  hp = "hp",
  attack = "attack",
  defense = "defense",
  specialAttack = "special-attack",
  specialDefense = "special-defense",
  speed = "speed"
}

const PokemonProvider: React.FC<PokemonProviderProps> = ({ children }) => {
  const [data, setData] = useState<INamedApiResource<IPokemon>[]>()
  const [pokemon, setPokemon] = useState<INamedApiResource<IPokemon>[]>()
  const [pokemonTypes, setPokemonTypes] = useState<INamedApiResource<IPokemonType>[]>()
  const [selectedPokemonTypes, setSelectedPokemonTypes] = useState<string[]>([])
  const [currentPokemonFilterNames, setCurrentPokemonFilterNames] = useState<PokemonFilterName>()
  const [favourites, setFavourites] = useState<string[]>([])
  const [query, setQuery] = useState<string>('')
  const [filters, setFilters] = useState<Filters>({} as Filters)
  const [error, setError] = useState<any>()

  useEffect(() => {
    fetchPokemonTypes()
    fetchPokemon()
  }, [])

  useEffect(() => {
    filterData()
  }, [filters, query, data, currentPokemonFilterNames])


  const filterData = async () => {


    let usingSpread : string[] = [];

    let sampleArray = { 'fire' : ['one', 'two', 'three'], 'water' : ['four', 'five']};

    Object.values(sampleArray).map((value) => {

         usingSpread.push(...value);

    });

    console.log("Using spread",  usingSpread);

    if (!data) {
      return
    }

    let filteredData = [...data]
    const fields = Object.keys(filters) as Field[]

    for (const field of fields) {
      switch (field) {
        case Field.favourite: {
          const value = filters[field]
          if (value) {
            filteredData = filteredData.filter((pokemon) => favourites.includes(pokemon.name))
          } else if (value === false) {
            filteredData = filteredData.filter((pokemon) => !favourites.includes(pokemon.name))
          }
          break
        }
      }
    }

    if (query) {
      filteredData = filteredData.filter((pokemon) => pokemon.name.includes(query))
    }

    // applying pokemon type filter if any pokemon type(s) selected
    if (selectedPokemonTypes.length) {
      console.log(selectedPokemonTypes)
      // const pokemonTypeFilterNames = 

      // {'poison': ['xy'], 'fire' : ['zz']};

   

      

      // Array.prototype.concat.apply([], Object.values(currentPokemonFilterNames));
      // filteredData = filteredData.filter((pokemon) => pokemonTypeFilterNames.includes(pokemon.name));
    }

    filteredData.sort((a, b) => {
      const aId = getIdFromUrl(a.url)
      const bId = getIdFromUrl(b.url)

      if (aId > bId) {
        return 1
      } else {
        return -1
      }
    })

    setPokemon(filteredData)
  }

  const fetchPokemonTypes = async () => {
    try {
      const allPokemonTypes = await PokeAPI.Type.listAll();
      console.log(allPokemonTypes);
      setPokemonTypes(allPokemonTypes.results);
    } catch (error) {
      setError(error);
    }
  }

  const fetchPokemon = async () => {
    try {
      const response = await PokeAPI.Pokemon.list(150, 0)
      setData(response.results)
      setPokemon(response.results)
    } catch (error) {
      setError(error)
    }
  }

  const togglePokemonTypeSelection = async (pokemonType: string) => {

   
    if (!selectedPokemonTypes.includes(pokemonType)) {
      setSelectedPokemonTypes((prevSelectedTypes) => [...prevSelectedTypes, pokemonType])

      const pokemonsByType = await PokeAPI.Type.fetch(pokemonType);

      if (pokemonsByType && pokemonsByType.pokemon.length) {
        const pokemonNamesByType = pokemonsByType.pokemon.map((pokemonObj) => pokemonObj.pokemon.name);
        // setCurrentPokemonFilterNames((prevFilterNames) => ({ ...prevFilterNames, [pokemonType]: pokemonNamesByType }))
      }
    } else {
      setSelectedPokemonTypes((prevSelectedTypes) => prevSelectedTypes.filter((selectedType) => selectedType !== pokemonType))
      // setCurrentPokemonFilterNames((prevFilterNames) => ({ ...prevFilterNames, [pokemonType]: [] }))
    }
  }

  const search = (query: string) => {
    setQuery(query)
  }

  function addFavourite(pokemon: INamedApiResource<IPokemon>) {
    setFavourites([...favourites, pokemon.name])
  }

  function removeFavourite(pokemon: INamedApiResource<IPokemon>) {
    setFavourites(favourites.filter((favourite) => favourite !== pokemon.name))
  }

  function addFilter(field: Field, value: FilterValue) {
    const newFilters = { ...filters, [field]: value }
    setFilters(newFilters)
  }

  function removeFilter(field: Field) {
    const newFilters = { ...filters }
    newFilters[field] = undefined
    setFilters(newFilters)
  }

  if (error) {
    return <div>Error</div>
  }

  if (!pokemon) {
    return <div></div>
  }

  return (
    <PokemonContext.Provider value={{
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
    }}>
      {children}
    </PokemonContext.Provider>
  )
}

export const usePokemonContext = () => {
  const pokemon = useContext(PokemonContext);

  if (!pokemon) {
    throw Error('Cannot use `usePokemonContext` outside of `PokemonProvider`');
  }

  return pokemon;
}

export default PokemonProvider;