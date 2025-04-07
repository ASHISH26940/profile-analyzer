import { Input } from '../src/components/ui/input'
import { Button } from '../src/components/ui/button'
import { useState } from 'react'
import { Octokit } from '@octokit/core'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../src/components/ui/card'
import { Search, GitBranch, Star, AlertCircle } from 'lucide-react'

type Repo = {
  id: number
  name: string
  html_url: string
  description: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
}

const octokit = new Octokit({
  auth: import.meta.env.VITE_GITHUB_TOKEN,
})

export default function App() {
  const [username, setUsername] = useState('')
  const [repos, setRepos] = useState<Repo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRepos = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await octokit.request('GET /users/{username}/repos', {
        username,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      })
      setRepos(res.data)
    } catch (err) {
      console.error(err)
      setError('Failed to fetch repositories. Please check the username and try again.')
      setRepos([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">GitHub Profile Analyzer</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Explore repositories from any GitHub user</p>
        </div>
        
        <div className="relative flex items-center mb-12">
          <div className="flex-1">
            <div className="relative">
              <Input
                placeholder="Enter GitHub username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pr-10 rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyDown={(e) => e.key === 'Enter' && username && fetchRepos()}
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>
          <Button 
            onClick={fetchRepos} 
            disabled={!username || loading} 
            className="ml-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </div>
        
        {error && (
          <div className="flex items-center p-4 mb-8 text-red-800 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20 dark:text-red-400">
            <AlertCircle className="mr-2" size={18} />
            <span>{error}</span>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div>
            {repos.length > 0 && (
              <p className="text-sm text-gray-500 mb-4">Found {repos.length} repositories for {username}</p>
            )}
            <div className="grid gap-6">
              {repos.map((repo) => (
                <Card key={repo.id} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="pb-2">
                    <CardTitle>
                      <a 
                        href={repo.html_url} 
                        className="text-blue-600 hover:text-blue-800 hover:underline flex items-center" 
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {repo.name}
                      </a>
                    </CardTitle>
                    {repo.language && (
                      <div className="text-xs font-medium inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                        {repo.language}
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    {repo.description && (
                      <CardDescription className="text-gray-600 dark:text-gray-300 mb-4">
                        {repo.description}
                      </CardDescription>
                    )}
                    <div className="flex text-sm text-gray-500">
                      <div className="flex items-center mr-4">
                        <Star size={14} className="mr-1" />
                        <span>{repo.stargazers_count}</span>
                      </div>
                      <div className="flex items-center">
                        <GitBranch size={14} className="mr-1" />
                        <span>{repo.forks_count}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {!loading && repos.length === 0 && !error && username && (
          <div className="text-center py-16">
            <p className="text-gray-500">No repositories found</p>
          </div>
        )}
      </div>
    </div>
  )
}