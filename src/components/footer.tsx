export default function Footer() {
  return (
    <footer className="border-t py-4 mt-auto bg-background">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Todo List App. All rights reserved.
        </p>
      </div>
    </footer>
  )
}



