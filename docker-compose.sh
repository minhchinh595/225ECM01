#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Helper functions
print_usage() {
    echo "Usage: $0 {start|stop|restart|logs|build|down|status}"
    echo ""
    echo "Commands:"
    echo "  start      - Start all services"
    echo "  stop       - Stop all services"
    echo "  restart    - Restart all services"
    echo "  logs       - Show logs from all services"
    echo "  build      - Build images"
    echo "  down       - Stop and remove containers, networks"
    echo "  status     - Show status of services"
}

case "$1" in
    start)
        echo -e "${GREEN}Starting services...${NC}"
        docker-compose up -d
        echo -e "${GREEN}Services started!${NC}"
        echo -e "${YELLOW}Frontend: http://localhost:3000${NC}"
        echo -e "${YELLOW}Backend API: http://localhost:8080/api${NC}"
        echo -e "${YELLOW}Database: localhost:5432${NC}"
        ;;
    stop)
        echo -e "${YELLOW}Stopping services...${NC}"
        docker-compose stop
        echo -e "${GREEN}Services stopped!${NC}"
        ;;
    restart)
        echo -e "${YELLOW}Restarting services...${NC}"
        docker-compose restart
        echo -e "${GREEN}Services restarted!${NC}"
        ;;
    logs)
        docker-compose logs -f
        ;;
    build)
        echo -e "${GREEN}Building images...${NC}"
        docker-compose build
        echo -e "${GREEN}Build completed!${NC}"
        ;;
    down)
        echo -e "${RED}Removing containers, networks...${NC}"
        docker-compose down
        echo -e "${GREEN}Cleaned up!${NC}"
        ;;
    status)
        docker-compose ps
        ;;
    *)
        print_usage
        exit 1
        ;;
esac

exit 0
